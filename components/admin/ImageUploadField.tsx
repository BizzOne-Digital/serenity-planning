"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { useToast } from "@/components/ui/ToastProvider";

export default function ImageUploadField({
  value,
  onChange,
  folder,
  label,
}: {
  value?: string;
  onChange: (url: string) => void;
  folder: "products" | "gallery" | "pages" | "misc";
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to upload image.", "error");
        return;
      }

      onChange(data.url);
      showToast("Image uploaded successfully.", "success");
    } catch {
      showToast("Failed to upload image. Please try again.", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>}
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-ink/10 bg-cream">
          <SafeImage src={value} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full border border-purple-primary/30 px-4 py-2 text-sm font-medium text-purple-primary hover:bg-purple-primary/5 disabled:opacity-60"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {value ? "Replace" : "Upload Image"}
            </button>
            {value && (
              <button
                type="button"
                disabled={uploading}
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-ink/50">JPEG, PNG, WEBP or GIF. Max 8MB.</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
