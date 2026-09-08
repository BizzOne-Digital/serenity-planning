import { LucideIcon } from "lucide-react";

export default function BenefitCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card bg-cream p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-warm/15 text-gold-warm">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-base font-semibold text-purple-deep">{title}</h3>
      <p className="text-sm leading-relaxed text-ink/70">{description}</p>
    </div>
  );
}
