import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { ensureSeeded } from "@/lib/seed";
import { serviceSchema, zodErrorToFieldErrors } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-helpers";
import { getCurrentSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await ensureSeeded();
    const session = await getCurrentSession();
    const filter = session ? {} : { isPublished: true };
    const services = await Service.find(filter).sort({ displayOrder: 1 });
    return NextResponse.json({ services });
  } catch (err) {
    console.error("Get services error:", err);
    return NextResponse.json({ error: "Failed to load services." }, { status: 500 });
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

  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input.", errors: zodErrorToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const service = await Service.create(parsed.data);
    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000) {
      return NextResponse.json({ error: "A service with that slug already exists." }, { status: 409 });
    }
    console.error("Create service error:", err);
    return NextResponse.json({ error: "Failed to create service." }, { status: 500 });
  }
}
