import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { ensureSeeded } from "@/lib/seed";
import { faqSchema, zodErrorToFieldErrors } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-helpers";
import { getCurrentSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await ensureSeeded();
    const session = await getCurrentSession();
    const filter = session ? {} : { isPublished: true };
    const faqs = await FAQ.find(filter).sort({ displayOrder: 1 });
    return NextResponse.json({ faqs });
  } catch (err) {
    console.error("Get faqs error:", err);
    return NextResponse.json({ error: "Failed to load FAQs." }, { status: 500 });
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

  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input.", errors: zodErrorToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const faq = await FAQ.create(parsed.data);
    return NextResponse.json({ success: true, faq }, { status: 201 });
  } catch (err) {
    console.error("Create faq error:", err);
    return NextResponse.json({ error: "Failed to create FAQ." }, { status: 500 });
  }
}
