import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { loginSchema, zodErrorToFieldErrors } from "@/lib/validations";
import { signSession, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input.", errors: zodErrorToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  try {
    await connectDB();

    let admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      const count = await Admin.countDocuments();
      const seedEmail = process.env.ADMIN_EMAIL?.toLowerCase();
      const seedPassword = process.env.ADMIN_PASSWORD;

      if (count === 0 && seedEmail && seedPassword && email.toLowerCase() === seedEmail) {
        const passwordHash = await bcrypt.hash(seedPassword, 10);
        admin = await Admin.create({ email: seedEmail, passwordHash, name: "Admin" });
      }
    }

    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await signSession({ adminId: admin._id.toString(), email: admin.email });
    await setSessionCookie(token);

    return NextResponse.json({ success: true, admin: { email: admin.email, name: admin.name } });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
