// import { PrismaClient } from "@prisma/client";
import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

// const prisma = new PrismaClient();
// THIS IS HOW TO MAKE THE CRUD RESPONSES
// FETCH ALL CATEGORIES
export const GET = async () => {
  try {
    const categories = await prisma.category.findMany();
    return new NextResponse(JSON.stringify(categories), { status: 200 });
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
