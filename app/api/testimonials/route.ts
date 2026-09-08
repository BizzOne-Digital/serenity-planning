import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { testimonialSchema, zodErrorToFieldErrors } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-helpers";
import { getCurrentSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();
    const session = await getCurrentSession();
    const filter = session ? {} : { isPublished: true };
    const testimonials = await Testimonial.find(filter).sort({ displayOrder: 1 });
    return NextResponse.json({ testimonials });
  } catch (err) {
    console.error("Get testimonials error:", err);
    return NextResponse.json({ error: "Failed to load testimonials." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input.", errors: zodErrorToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const testimonial = await Testimonial.create(parsed.data);
    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (err) {
    console.error("Create testimonial error:", err);
    return NextResponse.json({ error: "Failed to create testimonial." }, { status: 500 });
  }
}
