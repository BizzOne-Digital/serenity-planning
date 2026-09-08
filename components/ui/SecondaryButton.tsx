import Link from "next/link";

export default function SecondaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-gold-warm/70 px-7 py-3.5 text-base font-semibold text-ivory transition-all hover:bg-ivory/10 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-warm ${className}`}
    >
      {children}
    </Link>
  );
}
