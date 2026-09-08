import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { serviceUpdateSchema, zodErrorToFieldErrors } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-helpers";
import { deleteStoredUploadByUrl } from "@/lib/upload";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const service = await Service.findById(id);
    if (!service) return NextResponse.json({ error: "Service not found." }, { status: 404 });
    return NextResponse.json({ service });
  } catch (err) {
    console.error("Get service error:", err);
    return NextResponse.json({ error: "Failed to load service." }, { status: 500 });
  }
}

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

  const parsed = serviceUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input.", errors: zodErrorToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const service = await Service.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!service) return NextResponse.json({ error: "Service not found." }, { status: 404 });
    return NextResponse.json({ success: true, service });
  } catch (err) {
    console.error("Update service error:", err);
    return NextResponse.json({ error: "Failed to update service." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;

  try {
    await connectDB();
    const service = await Service.findByIdAndDelete(id);
    if (!service) return NextResponse.json({ error: "Service not found." }, { status: 404 });
    if (service.image) await deleteStoredUploadByUrl(service.image);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete service error:", err);
    return NextResponse.json({ error: "Failed to delete service." }, { status: 500 });
  }
}
