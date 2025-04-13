import { getAuthSession } from "@/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// THIS IS HOW TO MAKE THE CRUD RESPONSES
// FETCH single Product
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Matches Next.js dynamic route type
) => {
  const id = (await params).id; // Await the promise to get the id

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong! || Not found!!" },
      { status: 500 }
    );
  }
};

// Delete
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Matches Next.js dynamic route type
) => {
  const id = (await params).id; // Await the promise to get the id

  const session = await getAuthSession();

  if (session?.user.isAdmin) {
    try {
      await prisma.product.delete({
        where: {
          id: id,
        },
      });
      return NextResponse.json("Product Has Been Deleted!", { status: 200 });
    } catch (error) {
      // console.log(error);
      return NextResponse.json(
        { message: `Something went wrong! || ${error}` },
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

export const POST = () => {
  return new NextResponse("Hello", { status: 200 });
};
