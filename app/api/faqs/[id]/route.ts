import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { faqUpdateSchema, zodErrorToFieldErrors } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = faqUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input.", errors: zodErrorToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const faq = await FAQ.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!faq) return NextResponse.json({ error: "FAQ not found." }, { status: 404 });
    return NextResponse.json({ success: true, faq });
  } catch (err) {
    console.error("Update faq error:", err);
    return NextResponse.json({ error: "Failed to update FAQ." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  try {
    await connectDB();
    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) return NextResponse.json({ error: "FAQ not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete faq error:", err);
    return NextResponse.json({ error: "Failed to delete FAQ." }, { status: 500 });
  }
}
