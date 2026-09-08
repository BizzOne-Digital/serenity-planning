import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PageContent from "@/models/PageContent";
import { ensureSeeded } from "@/lib/seed";
import { contentUpdateSchema, zodErrorToFieldErrors } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  try {
    await ensureSeeded();
    if (page) {
      const content = await PageContent.findOne({ page });
      if (!content) return NextResponse.json({ error: "Page content not found." }, { status: 404 });
      return NextResponse.json({ content });
    }
    const contents = await PageContent.find();
    return NextResponse.json({ contents });
  } catch (err) {
    console.error("Get content error:", err);
    return NextResponse.json({ error: "Failed to load content." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input.", errors: zodErrorToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  const { page, sections, seo } = parsed.data;

  try {
    await connectDB();
    const update: Record<string, unknown> = {};
    if (sections) update.sections = sections;
    if (seo) update.seo = seo;

    const content = await PageContent.findOneAndUpdate(
      { page },
      { $set: update },
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, content });
  } catch (err) {
    console.error("Update content error:", err);
    return NextResponse.json({ error: "Failed to update content." }, { status: 500 });
  }
}
