import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";
import { requireAdmin } from "@/lib/api-helpers";
import { UPLOAD_FOLDERS } from "@/lib/upload";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");

  try {
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (folder && UPLOAD_FOLDERS.includes(folder as (typeof UPLOAD_FOLDERS)[number])) {
      filter.folder = folder;
    }
    const media = await StoredUpload.find(filter).select("-data").sort({ createdAt: -1 });
    return NextResponse.json({ media });
  } catch (err) {
    console.error("Get media error:", err);
    return NextResponse.json({ error: "Failed to load media." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing media id." }, { status: 400 });

  try {
    await connectDB();
    const deleted = await StoredUpload.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Media not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete media error:", err);
    return NextResponse.json({ error: "Failed to delete media." }, { status: 500 });
  }
}
