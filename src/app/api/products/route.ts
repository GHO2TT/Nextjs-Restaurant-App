import { getAuthSession } from "@/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// THIS IS HOW TO MAKE THE CRUD RESPONSES
// FETCH ALL Products
export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  console.log("Fetching products. Query category:", cat);

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(cat ? { catSlug: cat } : { isFeatured: true }),
        // catSlug: cat as string,
      },
    });
    console.log("Fetching products. Query category:", cat);
    console.log("Fetched products:", products);
    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error("PRODUCT FETCH ERROR:", error);

    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// export const POST = () => {
//   return new NextResponse("Hello", { status: 200 });
// };

// add product
export const POST = async (req: NextRequest) => {
  const session = await getAuthSession();

  if (!session || !session.user?.email || !session.user?.isAdmin) {
    return new NextResponse(
      JSON.stringify({
        message: "Please Login to add product / you are not admin",
      }),
      { status: 401 }
    );
  }

  const body = await req.json();
  try {
    const product = await prisma.product.create({
      data: body,
    });

    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!, Product not created" }),
      { status: 500 }
    );
  }
};
