"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { useToast } from "@/components/ui/ToastProvider";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  isPublished: boolean;
  displayOrder: number;
}

export default function AdminFaqsPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null);
  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/faqs");
    const data = await res.json();
    setItems(data.faqs || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd() {
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, isPublished: true, displayOrder: items.length }),
      });
      if (!res.ok) {
        showToast("Failed to add FAQ.", "error");
        return;
      }
      showToast("FAQ added.", "success");
      setQuestion("");
      setAnswer("");
      load();
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(item: FaqItem) {
    await fetch(`/api/faqs/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !item.isPublished }),
    });
    load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/faqs/${deleteTarget._id}`, { method: "DELETE" });
    if (!res.ok) {
      showToast("Failed to delete FAQ.", "error");
      return;
    }
    showToast("FAQ deleted.", "success");
    setDeleteTarget(null);
    load();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-purple-deep">FAQs</h1>

      <div className="rounded-card border border-ink/10 bg-white p-5 space-y-3">
        <h2 className="font-serif text-lg font-semibold text-purple-deep">Add FAQ</h2>
        <input
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Answer"
          rows={3}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gold-warm px-4 py-2 text-sm font-semibold text-purple-deep hover:bg-gold-champagne disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add FAQ
        </button>
      </div>

      {loading ? (
        <p className="text-ink/60">Loading...</p>
      ) : items.length === 0 ? (
        <p className="rounded-card border border-ink/10 bg-white p-8 text-center text-sm text-ink/50">No FAQs yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="flex items-start justify-between gap-4 rounded-card border border-ink/10 bg-white p-4">
              <div>
                <p className="font-medium text-ink">{item.question}</p>
                <p className="mt-1 text-sm text-ink/70">{item.answer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => togglePublish(item)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${item.isPublished ? "bg-green-100 text-green-700" : "bg-ink/10 text-ink/60"}`}
                >
                  {item.isPublished ? "Published" : "Hidden"}
                </button>
                <button onClick={() => setDeleteTarget(item)} aria-label={`Delete FAQ: ${item.question}`} className="rounded-full p-2 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete this FAQ?"
        message="This question and answer will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
