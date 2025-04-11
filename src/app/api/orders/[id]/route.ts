import { getAuthSession } from "@/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  const { id } = context.params;

  try {
    const body = await req.json();
    const updatedOrder = await prisma.order.update({
      where: {
        id: id,
      },
      data: { status: body.status },
    });
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};

// Delete
export const DELETE = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  const { id } = context.params;

  const session = await getAuthSession();

  if (session?.user.isAdmin) {
    try {
      const order = await prisma.order.delete({
        where: {
          id: id,
        },
      });
      return NextResponse.json("Order Has Been Deleted!", { status: 200 });
    } catch (error) {
      // console.log(error);
      return NextResponse.json(
        { message: "Something went wrong! || Not found!!" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Permission not Granted" },
      { status: 403 }
    );
  }
};
