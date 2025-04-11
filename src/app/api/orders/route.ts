import { getAuthSession } from "@/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// THIS IS HOW TO MAKE THE CRUD RESPONSES
// FETCH ALL Orders
export const GET = async () => {
  const session = await getAuthSession();
  if (!session || !session.user?.email) {
    return new NextResponse(
      JSON.stringify({ message: "Please Login to see your orders" }),
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not Found" }), {
        status: 404,
      });
    }
    if (!user.email) {
      return new NextResponse(
        JSON.stringify({ message: "User email not found" }),
        {
          status: 400,
        }
      );
    }
    let orders;

    if (user.isAdmin) {
      // Admin fetches all orders
      orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Regular user fetches their own orders
      orders = await prisma.order.findMany({
        where: {
          userEmail: user.email,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return new NextResponse(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// Create New Order
export const POST = async (req: NextRequest) => {
  const session = await getAuthSession();
  if (!session || !session.user?.email) {
    return new NextResponse(
      JSON.stringify({ message: "Please Login to Order" }),
      { status: 401 }
    );
  }

  const body = await req.json();
  try {
    const orders = await prisma.order.create({
      data: body,
    });

    return new NextResponse(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Order could not be created" }),
      { status: 500 }
    );
  }
};
