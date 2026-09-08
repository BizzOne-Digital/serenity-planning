"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminTable from "@/components/admin/AdminTable";
import { useToast } from "@/components/ui/ToastProvider";

interface Appointment {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  planType: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  adminNotes?: string;
  notes?: string;
  createdAt: string;
}

const STATUSES = ["all", "new", "contacted", "scheduled", "completed", "cancelled"] as const;

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [status, setStatus] = useState("new");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/appointments");
    const data = await res.json();
    setAppointments(data.appointments || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openDetail(a: Appointment) {
    setSelected(a);
    setStatus(a.status);
    setAdminNotes(a.adminNotes || "");
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/appointments/${selected._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes }),
      });
      if (!res.ok) {
        showToast("Failed to update appointment.", "error");
        return;
      }
      showToast("Appointment updated.", "success");
      setSelected(null);
      load();
    } catch {
      showToast("Failed to update appointment.", "error");
    } finally {
      setSaving(false);
    }
  }

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-purple-deep">Appointments</h1>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize ${
              filter === s ? "bg-purple-primary text-ivory" : "bg-white text-ink/70 border border-ink/10"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink/60">Loading...</p>
      ) : (
        <AdminTable
          rows={filtered}
          onRowClick={openDetail}
          emptyLabel="No appointments found."
          columns={[
            { header: "Name", render: (r) => r.fullName },
            { header: "Contact", render: (r) => `${r.email} · ${r.phone}` },
            { header: "Plan Type", render: (r) => r.planType },
            { header: "Preferred", render: (r) => [r.preferredDate, r.preferredTime].filter(Boolean).join(" ") || "—" },
            { header: "Status", render: (r) => <span className="capitalize">{r.status}</span> },
          ]}
        />
      )}

      {selected && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/60 p-4">
          <div className="w-full max-w-md rounded-card bg-white p-6 shadow-xl">
            <h2 className="font-serif text-lg font-semibold text-purple-deep">{selected.fullName}</h2>
            <p className="mt-1 text-sm text-ink/60">
              {selected.email} · {selected.phone}
            </p>
            {selected.notes && <p className="mt-3 text-sm text-ink/70">Notes from family: {selected.notes}</p>}

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-ink">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm">
                {STATUSES.filter((s) => s !== "all").map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-ink">Admin Notes</label>
              <textarea
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="rounded-full border border-ink/20 px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-gold-warm px-4 py-2 text-sm font-semibold text-purple-deep hover:bg-gold-champagne disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
