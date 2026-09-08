"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminTopbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-ink/10 bg-white px-6 py-4">
      <p className="text-sm font-medium text-ink/60">Serenity Planning Admin</p>
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Log Out
      </button>
    </header>
  );
}
