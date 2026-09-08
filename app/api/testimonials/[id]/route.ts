import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { testimonialUpdateSchema, zodErrorToFieldErrors } from "@/lib/validations";
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

  const parsed = testimonialUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input.", errors: zodErrorToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const testimonial = await Testimonial.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!testimonial) return NextResponse.json({ error: "Testimonial not found." }, { status: 404 });
    return NextResponse.json({ success: true, testimonial });
  } catch (err) {
    console.error("Update testimonial error:", err);
    return NextResponse.json({ error: "Failed to update testimonial." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  try {
    await connectDB();
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) return NextResponse.json({ error: "Testimonial not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete testimonial error:", err);
    return NextResponse.json({ error: "Failed to delete testimonial." }, { status: 500 });
  }
}
