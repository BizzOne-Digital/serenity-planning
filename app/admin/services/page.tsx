"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import AdminTable from "@/components/admin/AdminTable";
import ImageUploadField from "@/components/admin/ImageUploadField";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { useToast } from "@/components/ui/ToastProvider";

interface ServiceRow {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image?: string;
  icon?: string;
  benefits: string[];
  displayOrder: number;
  isPublished: boolean;
}

const EMPTY: Omit<ServiceRow, "_id"> = {
  title: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  image: "",
  icon: "HeartHandshake",
  benefits: [],
  displayOrder: 0,
  isPublished: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ServiceRow | null>(null);
  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/services");
    const data = await res.json();
    setServices(data.services || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(s: ServiceRow) {
    setEditing(s);
    setForm({ ...s, benefits: s.benefits || [] });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = editing ? `/api/services/${editing._id}` : "/api/services";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to save service.", "error");
        return;
      }
      showToast("Service saved successfully.", "success");
      setShowForm(false);
      load();
    } catch {
      showToast("Failed to save service.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/services/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) {
        showToast("Failed to delete service.", "error");
        return;
      }
      showToast("Service deleted.", "success");
      setDeleteTarget(null);
      load();
    } catch {
      showToast("Failed to delete service.", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-purple-deep">Services</h1>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-gold-warm px-4 py-2.5 text-sm font-semibold text-purple-deep hover:bg-gold-champagne"
        >
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {loading ? (
        <p className="text-ink/60">Loading...</p>
      ) : (
        <AdminTable
          rows={services}
          emptyLabel="No services yet."
          columns={[
            { header: "Title", render: (r) => r.title },
            { header: "Order", render: (r) => r.displayOrder },
            {
              header: "Status",
              render: (r) => (
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${r.isPublished ? "bg-green-100 text-green-700" : "bg-ink/10 text-ink/60"}`}>
                  {r.isPublished ? "Published" : "Hidden"}
                </span>
              ),
            },
            {
              header: "Actions",
              render: (r) => (
                <div className="flex gap-2">
                  <button onClick={() => openEdit(r)} className="rounded-full p-2 text-purple-primary hover:bg-purple-primary/10" aria-label={`Edit ${r.title}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(r)} className="rounded-full p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${r.title}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}

      {showForm && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/60 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-xl rounded-card bg-white p-6 shadow-xl">
            <h2 className="font-serif text-lg font-semibold text-purple-deep">
              {editing ? "Edit Service" : "Add Service"}
            </h2>
            <div className="mt-4 space-y-4">
              <TextField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
              <TextField label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
              <TextField
                label="Short Description"
                value={form.shortDescription}
                onChange={(v) => setForm({ ...form, shortDescription: v })}
                textarea
              />
              <TextField
                label="Full Description"
                value={form.fullDescription}
                onChange={(v) => setForm({ ...form, fullDescription: v })}
                textarea
              />
              <ImageUploadField
                label="Service Image"
                folder="products"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Benefits</label>
                <div className="space-y-2">
                  {form.benefits.map((b, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={b}
                        onChange={(e) => {
                          const next = [...form.benefits];
                          next[i] = e.target.value;
                          setForm({ ...form, benefits: next });
                        }}
                        className="flex-1 rounded-lg border border-ink/15 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, benefits: form.benefits.filter((_, idx) => idx !== i) })}
                        className="rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, benefits: [...form.benefits, ""] })}
                    className="text-sm font-medium text-purple-primary hover:underline"
                  >
                    + Add Benefit
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">Display Order</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                    className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                      className="h-4 w-4 text-gold-warm"
                    />
                    Published
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-full border border-ink/20 px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-gold-warm px-4 py-2 text-sm font-semibold text-purple-deep hover:bg-gold-champagne disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete this service?"
        message={`"${deleteTarget?.title}" will be permanently removed from your website.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}
