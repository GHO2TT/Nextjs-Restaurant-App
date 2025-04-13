import { getAuthSession } from "@/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// GET Single Product
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong! || Not found!!" },
      { status: 500 }
    );
  }
}

// DELETE Product
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const session = await getAuthSession();

  if (!session?.user.isAdmin) {
    return NextResponse.json(
      { message: "Permission not Granted" },
      { status: 403 }
    );
  }

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json("Product Has Been Deleted!", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong! || ${error}` },
      { status: 500 }
    );
  }
}

// POST - Example
export async function POST() {
  return new NextResponse("Hello", { status: 200 });
}
