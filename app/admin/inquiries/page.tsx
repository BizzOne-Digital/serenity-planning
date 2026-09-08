"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import AdminTable from "@/components/admin/AdminTable";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { useToast } from "@/components/ui/ToastProvider";

interface Inquiry {
  _id: string;
  fullName: string;
  email: string;
  interestedIn: string;
  message: string;
  status: string;
  createdAt: string;
}

const STATUSES = ["all", "new", "reviewed", "contacted", "closed"] as const;

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("all");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/inquiries");
    const data = await res.json();
    setInquiries(data.inquiries || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      showToast("Failed to update inquiry.", "error");
      return;
    }
    load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/inquiries/${deleteTarget._id}`, { method: "DELETE" });
    if (!res.ok) {
      showToast("Failed to delete inquiry.", "error");
      return;
    }
    showToast("Inquiry deleted.", "success");
    setDeleteTarget(null);
    load();
  }

  const filtered = filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-purple-deep">Inquiries</h1>

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
          emptyLabel="No inquiries found."
          columns={[
            { header: "Name", render: (r) => r.fullName },
            { header: "Email", render: (r) => r.email },
            { header: "Interested In", render: (r) => r.interestedIn },
            { header: "Message", render: (r) => <span className="line-clamp-2 max-w-xs">{r.message}</span> },
            {
              header: "Status",
              render: (r) => (
                <select
                  value={r.status}
                  onChange={(e) => updateStatus(r._id, e.target.value)}
                  className="rounded-lg border border-ink/15 px-2 py-1 text-xs capitalize"
                >
                  {STATUSES.filter((s) => s !== "all").map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              ),
            },
            {
              header: "",
              render: (r) => (
                <button onClick={() => setDeleteTarget(r)} aria-label={`Delete inquiry from ${r.fullName}`} className="rounded-full p-2 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              ),
            },
          ]}
        />
      )}

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete this inquiry?"
        message={`The inquiry from "${deleteTarget?.fullName}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
