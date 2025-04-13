import { getAuthSession } from "@/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Matches Next.js dynamic route type
) {
  const id = (await params).id; // Await the promise to get the id

  try {
    const body = await req.json();
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: body.status },
    });
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Matches Next.js dynamic route type
) {
  const id = (await params).id; // Await the promise to get the id
  const session = await getAuthSession();

  if (!session?.user.isAdmin) {
    return NextResponse.json(
      { message: "Permission not Granted" },
      { status: 403 }
    );
  }

  try {
    await prisma.order.delete({ where: { id } });
    return NextResponse.json("Order Has Been Deleted!", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong || ${error}` },
      { status: 500 }
    );
  }
}
