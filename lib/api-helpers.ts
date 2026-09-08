import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getCurrentSession();
  if (!session) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}

export function jsonError(message: string, status = 400, errors?: Record<string, string>) {
  return NextResponse.json({ error: message, ...(errors ? { errors } : {}) }, { status });
}
