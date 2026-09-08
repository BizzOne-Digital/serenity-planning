import Link from "next/link";
import { CalendarCheck, Mail, ListChecks, FileText, Image as ImageIcon } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { ensureSeeded } from "@/lib/seed";
import Appointment from "@/models/Appointment";
import Inquiry from "@/models/Inquiry";
import Service from "@/models/Service";
import PageContent from "@/models/PageContent";
import StoredUpload from "@/models/StoredUpload";
import AdminCard from "@/components/admin/AdminCard";
import AdminTable from "@/components/admin/AdminTable";

export const dynamic = "force-dynamic";

interface AppointmentRow {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  planType: string;
  status: string;
}

interface InquiryRow {
  _id: string;
  fullName: string;
  email: string;
  interestedIn: string;
  status: string;
}

export default async function AdminDashboardPage() {
  await ensureSeeded();
  await connectDB();

  const [newAppointments, pendingInquiries, totalServices, publishedPages, totalMedia, recentAppointments, recentInquiries] =
    await Promise.all([
      Appointment.countDocuments({ status: "new" }),
      Inquiry.countDocuments({ status: "new" }),
      Service.countDocuments(),
      PageContent.countDocuments(),
      StoredUpload.countDocuments(),
      Appointment.find().sort({ createdAt: -1 }).limit(5).lean(),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl font-semibold text-purple-deep">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <AdminCard label="New Appointments" value={newAppointments} icon={CalendarCheck} />
        <AdminCard label="Pending Inquiries" value={pendingInquiries} icon={Mail} />
        <AdminCard label="Total Services" value={totalServices} icon={ListChecks} />
        <AdminCard label="Published Content Pages" value={publishedPages} icon={FileText} />
        <AdminCard label="Uploaded Media" value={totalMedia} icon={ImageIcon} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction href="/admin/content" label="Edit Homepage" />
        <QuickAction href="/admin/services" label="Add Service" />
        <QuickAction href="/admin/media" label="Upload Image" />
        <QuickAction href="/admin/settings" label="Update Contact Info" />
      </div>

      <div>
        <h2 className="mb-3 font-serif text-lg font-semibold text-purple-deep">Recent Appointments</h2>
        <AdminTable
          rows={JSON.parse(JSON.stringify(recentAppointments)) as AppointmentRow[]}
          emptyLabel="No appointments yet."
          columns={[
            { header: "Name", render: (r) => r.fullName },
            { header: "Contact", render: (r) => `${r.email} · ${r.phone}` },
            { header: "Plan Type", render: (r) => r.planType },
            { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
        />
      </div>

      <div>
        <h2 className="mb-3 font-serif text-lg font-semibold text-purple-deep">Recent Inquiries</h2>
        <AdminTable
          rows={JSON.parse(JSON.stringify(recentInquiries)) as InquiryRow[]}
          emptyLabel="No inquiries yet."
          columns={[
            { header: "Name", render: (r) => r.fullName },
            { header: "Email", render: (r) => r.email },
            { header: "Interested In", render: (r) => r.interestedIn },
            { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
        />
      </div>
    </div>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-card border border-ink/10 bg-white p-4 text-center text-sm font-medium text-purple-primary shadow-sm hover:bg-purple-primary/5"
    >
      {label}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-full bg-purple-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-purple-primary">
      {status}
    </span>
  );
}
