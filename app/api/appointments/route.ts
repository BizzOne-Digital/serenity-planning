import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { bookingSchema, zodErrorToFieldErrors } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-helpers";
import { sendNotificationEmail } from "@/lib/mail";

export const runtime = "nodejs";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    await connectDB();
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return NextResponse.json({ appointments });
  } catch (err) {
    console.error("Get appointments error:", err);
    return NextResponse.json({ error: "Failed to load appointments." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input.", errors: zodErrorToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    // Honeypot triggered; pretend success to not tip off bots.
    return NextResponse.json({ success: true });
  }

  try {
    await connectDB();
    const { website: _website, ...data } = parsed.data;
    const appointment = await Appointment.create(data);

    // Awaited so the notification actually completes before this serverless
    // function returns/freezes — a detached fire-and-forget promise here was
    // silently dropped on Vercel before the SMTP send finished.
    await sendNotificationEmail(
      "New Consultation Request - Serenity Planning",
      `New appointment request from ${appointment.fullName} (${appointment.email}, ${appointment.phone}).`
    );

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (err) {
    console.error("Create appointment error:", err);
    return NextResponse.json({ error: "Failed to submit your request. Please try again." }, { status: 500 });
  }
}
