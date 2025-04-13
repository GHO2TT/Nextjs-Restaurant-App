import { NextResponse } from "next/server";
import { prisma } from "@/utils/connect";

export const GET = async () => {
  try {
    const result = await prisma.product.findFirst();
    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
};
