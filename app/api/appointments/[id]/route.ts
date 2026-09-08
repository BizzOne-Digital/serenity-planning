import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { appointmentUpdateSchema, zodErrorToFieldErrors } from "@/lib/validations";
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

  const parsed = appointmentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input.", errors: zodErrorToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const appointment = await Appointment.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!appointment) return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
    return NextResponse.json({ success: true, appointment });
  } catch (err) {
    console.error("Update appointment error:", err);
    return NextResponse.json({ error: "Failed to update appointment." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  try {
    await connectDB();
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete appointment error:", err);
    return NextResponse.json({ error: "Failed to delete appointment." }, { status: 500 });
  }
}
