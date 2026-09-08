"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { useToast } from "@/components/ui/ToastProvider";

interface Testimonial {
  _id: string;
  name: string;
  quote: string;
  isPublished: boolean;
  displayOrder: number;
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/testimonials");
    const data = await res.json();
    setItems(data.testimonials || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd() {
    if (!name.trim() || !quote.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quote, isPublished: true, displayOrder: items.length }),
      });
      if (!res.ok) {
        showToast("Failed to add testimonial.", "error");
        return;
      }
      showToast("Testimonial added.", "success");
      setName("");
      setQuote("");
      load();
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(item: Testimonial) {
    await fetch(`/api/testimonials/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !item.isPublished }),
    });
    load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/testimonials/${deleteTarget._id}`, { method: "DELETE" });
    if (!res.ok) {
      showToast("Failed to delete testimonial.", "error");
      return;
    }
    showToast("Testimonial deleted.", "success");
    setDeleteTarget(null);
    load();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-purple-deep">Testimonials</h1>

      <div className="rounded-card border border-ink/10 bg-white p-5 space-y-3">
        <h2 className="font-serif text-lg font-semibold text-purple-deep">Add Testimonial</h2>
        <input
          placeholder="Client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Testimonial quote"
          rows={3}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gold-warm px-4 py-2 text-sm font-semibold text-purple-deep hover:bg-gold-champagne disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add Testimonial
        </button>
      </div>

      {loading ? (
        <p className="text-ink/60">Loading...</p>
      ) : items.length === 0 ? (
        <p className="rounded-card border border-ink/10 bg-white p-8 text-center text-sm text-ink/50">No testimonials yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="flex items-start justify-between gap-4 rounded-card border border-ink/10 bg-white p-4">
              <div>
                <p className="font-medium text-ink">{item.name}</p>
                <p className="mt-1 text-sm text-ink/70">&ldquo;{item.quote}&rdquo;</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => togglePublish(item)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${item.isPublished ? "bg-green-100 text-green-700" : "bg-ink/10 text-ink/60"}`}
                >
                  {item.isPublished ? "Published" : "Hidden"}
                </button>
                <button onClick={() => setDeleteTarget(item)} aria-label={`Delete testimonial from ${item.name}`} className="rounded-full p-2 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete this testimonial?"
        message={`The testimonial from "${deleteTarget?.name}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
