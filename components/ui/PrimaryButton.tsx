import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

interface LinkProps extends BaseProps {
  href: string;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({ href, children, className = "" }: LinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gold-warm px-7 py-3.5 text-base font-semibold text-purple-deep transition-all hover:bg-gold-champagne hover:-translate-y-0.5 hover:shadow-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-warm ${className}`}
    >
      {children}
    </Link>
  );
}

export function PrimaryButtonEl({ children, className = "", ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gold-warm px-7 py-3.5 text-base font-semibold text-purple-deep transition-all hover:bg-gold-champagne hover:-translate-y-0.5 hover:shadow-gold disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-warm ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
