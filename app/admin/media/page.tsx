"use client";

import { useEffect, useState } from "react";
import { Copy, Trash2, Upload } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { useToast } from "@/components/ui/ToastProvider";

interface MediaItem {
  _id: string;
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

const FOLDERS = ["all", "products", "gallery", "pages", "misc"] as const;

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [folder, setFolder] = useState<(typeof FOLDERS)[number]>("all");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    const qs = folder !== "all" ? `?folder=${folder}` : "";
    const res = await fetch(`/api/media${qs}`);
    const data = await res.json();
    setMedia(data.media || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder === "all" ? "misc" : folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Upload failed.", "error");
        return;
      }
      showToast("Image uploaded.", "success");
      load();
    } catch {
      showToast("Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/media?id=${deleteTarget._id}`, { method: "DELETE" });
    if (!res.ok) {
      showToast("Failed to delete media.", "error");
      return;
    }
    showToast("Media deleted.", "success");
    setDeleteTarget(null);
    load();
  }

  function copyUrl(item: MediaItem) {
    const url = `${window.location.origin}/api/uploads/${item.folder}/${item.filename}`;
    navigator.clipboard.writeText(url).then(() => showToast("URL copied to clipboard.", "success"));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-semibold text-purple-deep">Media Library</h1>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold-warm px-4 py-2.5 text-sm font-semibold text-purple-deep hover:bg-gold-champagne">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="flex gap-2">
        {FOLDERS.map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize ${
              folder === f ? "bg-purple-primary text-ivory" : "bg-white text-ink/70 border border-ink/10"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink/60">Loading...</p>
      ) : media.length === 0 ? (
        <p className="rounded-card border border-ink/10 bg-white p-8 text-center text-sm text-ink/50">
          No media uploaded yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <div key={item._id} className="rounded-card border border-ink/10 bg-white p-3">
              <div className="aspect-square overflow-hidden rounded-lg bg-cream">
                <SafeImage
                  src={`/api/uploads/${item.folder}/${item.filename}`}
                  alt={item.filename}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2 truncate text-xs font-medium text-ink" title={item.filename}>
                {item.filename}
              </p>
              <p className="text-xs text-ink/50">
                {item.folder} · {(item.size / 1024).toFixed(0)} KB
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => copyUrl(item)}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-full border border-ink/15 px-2 py-1.5 text-xs font-medium text-ink hover:bg-ink/5"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy URL
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  aria-label={`Delete ${item.filename}`}
                  className="rounded-full border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationDialog
        open={!!deleteTarget}
        title="Delete this image?"
        message="This image will be permanently removed. It may still be referenced elsewhere on the site."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
