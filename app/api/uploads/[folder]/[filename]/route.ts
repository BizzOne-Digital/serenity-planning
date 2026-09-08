import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";
import { UPLOAD_FOLDERS } from "@/lib/upload";

export const runtime = "nodejs";

const SAFE_FILENAME = /^[a-zA-Z0-9_-]+\.[a-z]+$/;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder, filename } = await params;

  if (!UPLOAD_FOLDERS.includes(folder as (typeof UPLOAD_FOLDERS)[number])) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (
    !filename ||
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\") ||
    filename.includes("\0") ||
    !SAFE_FILENAME.test(filename)
  ) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    await connectDB();
    const doc = await StoredUpload.findOne({ folder, filename });
    if (!doc) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return new Response(new Uint8Array(doc.data), {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Length": String(doc.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Serve upload error:", err);
    return NextResponse.json({ error: "Failed to load file." }, { status: 500 });
  }
}
