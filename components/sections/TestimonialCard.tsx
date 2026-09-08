import { Quote } from "lucide-react";

export default function TestimonialCard({ name, quote }: { name: string; quote: string }) {
  return (
    <div className="mx-auto max-w-2xl rounded-card bg-white p-8 text-center shadow-sm">
      <Quote className="mx-auto mb-4 h-8 w-8 text-gold-warm" aria-hidden="true" />
      <p className="font-serif text-lg italic leading-relaxed text-purple-deep">&ldquo;{quote}&rdquo;</p>
      <p className="mt-4 text-sm font-semibold text-ink/70">— {name}</p>
    </div>
  );
}
