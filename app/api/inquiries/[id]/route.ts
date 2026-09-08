import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { inquiryUpdateSchema, zodErrorToFieldErrors } from "@/lib/validations";
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

  const parsed = inquiryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input.", errors: zodErrorToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const inquiry = await Inquiry.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!inquiry) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    return NextResponse.json({ success: true, inquiry });
  } catch (err) {
    console.error("Update inquiry error:", err);
    return NextResponse.json({ error: "Failed to update inquiry." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  try {
    await connectDB();
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete inquiry error:", err);
    return NextResponse.json({ error: "Failed to delete inquiry." }, { status: 500 });
  }
}
