import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { contactSchema, zodErrorToFieldErrors } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-helpers";
import { sendNotificationEmail } from "@/lib/mail";

export const runtime = "nodejs";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json({ inquiries });
  } catch (err) {
    console.error("Get inquiries error:", err);
    return NextResponse.json({ error: "Failed to load inquiries." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input.", errors: zodErrorToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  try {
    await connectDB();
    const { website: _website, ...data } = parsed.data;
    const inquiry = await Inquiry.create(data);

    sendNotificationEmail(
      "New Inquiry - Serenity Planning",
      `New inquiry from ${inquiry.fullName} (${inquiry.email}). Message: ${inquiry.message}`
    ).catch(() => {});

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (err) {
    console.error("Create inquiry error:", err);
    return NextResponse.json({ error: "Failed to submit your request. Please try again." }, { status: 500 });
  }
}
