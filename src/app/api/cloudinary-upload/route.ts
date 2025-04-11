import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "products" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed", detail: error },
      { status: 500 }
    );
  }
}
