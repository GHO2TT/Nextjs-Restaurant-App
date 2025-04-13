import { getAuthSession } from "@/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// Type for order status update body
interface OrderStatusUpdate {
  status: string;
}

// Type for route parameters
interface OrderRouteParams {
  id: string;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: OrderRouteParams }
) {
  const { id } = params;

  try {
    const body: OrderStatusUpdate = await req.json();

    if (!body.status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("PUT /api/orders error:", error);
    return NextResponse.json(
      { message: "Failed to update order status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: OrderRouteParams }
) {
  const { id } = params;
  const session = await getAuthSession();

  if (!session?.user.isAdmin) {
    return NextResponse.json(
      { message: "Unauthorized: Admin access required" },
      { status: 403 }
    );
  }

  try {
    await prisma.order.delete({ where: { id } });
    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/orders error:", error);
    return NextResponse.json(
      {
        message: "Failed to delete order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
