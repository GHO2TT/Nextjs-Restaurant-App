import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// THIS IS HOW TO MAKE THE CRUD RESPONSES
// FETCH ALL Products
export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  try {
    const products = await prisma.product.findMany({
      where: {
        ...(cat ? { catSlug: cat } : { isFeatured: true }),
        // catSlug: cat as string,
      },
    });
    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
export const POST = () => {
  return new NextResponse("Hello", { status: 200 });
};
