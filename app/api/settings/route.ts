import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { ensureSeeded } from "@/lib/seed";
import { settingsSchema, zodErrorToFieldErrors } from "@/lib/validations";
import { requireAdmin } from "@/lib/api-helpers";
import { getCurrentSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await ensureSeeded();
    const settings = await SiteSettings.findOne();
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({
        settings: settings
          ? {
              businessName: settings.businessName,
              logo: settings.logo,
              secondaryLogo: settings.secondaryLogo,
              favicon: settings.favicon,
              phone: settings.phone,
              email: settings.email,
              serviceArea: settings.serviceArea,
              socialLinks: settings.socialLinks,
              primaryCtaLabel: settings.primaryCtaLabel,
              primaryCtaDestination: settings.primaryCtaDestination,
              footerText: settings.footerText,
              businessHours: settings.businessHours,
              copyrightText: settings.copyrightText,
            }
          : null,
      });
    }

    return NextResponse.json({ settings });
  } catch (err) {
    console.error("Get settings error:", err);
    return NextResponse.json({ error: "Failed to load settings." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your input.", errors: zodErrorToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const settings = await SiteSettings.findOneAndUpdate({}, { $set: parsed.data }, { new: true, upsert: true });
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error("Update settings error:", err);
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
