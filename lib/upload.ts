import { connectDB } from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";

export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

const SAFE_FILENAME = /^[a-zA-Z0-9_-]+\.[a-z]+$/;

export function parseUploadUrl(url: string): { folder: string; filename: string } | null {
  const match = url.match(/^\/api\/uploads\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (!match) return null;
  const [, folder, filename] = match;
  if (!UPLOAD_FOLDERS.includes(folder as UploadFolder)) return null;
  if (!SAFE_FILENAME.test(filename)) return null;
  return { folder, filename };
}

export async function deleteStoredUploadByUrl(url?: string | null): Promise<void> {
  if (!url) return;
  const parsed = parseUploadUrl(url);
  if (!parsed) return;
  try {
    await connectDB();
    await StoredUpload.deleteOne({ folder: parsed.folder, filename: parsed.filename });
  } catch (err) {
    console.error("Failed to delete stored upload (non-blocking):", err);
  }
}
