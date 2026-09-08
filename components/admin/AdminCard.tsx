import { LucideIcon } from "lucide-react";

export default function AdminCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-4 rounded-card border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-primary/5 text-purple-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-purple-deep">{value}</p>
        <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{label}</p>
      </div>
    </div>
  );
}
