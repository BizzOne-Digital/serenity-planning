"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import LanguageToggle from "@/components/ui/LanguageToggle";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-purple-deep/90 backdrop-blur-md border-b border-gold-warm/30 py-2"
          : "bg-purple-deep py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center" aria-label="Serenity Planning — Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Serenity Planning — Pre-Need Services"
            className={`w-auto transition-all duration-300 ${scrolled ? "h-12" : "h-16"}`}
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-gold-warm ${
                pathname === link.href ? "text-gold-warm" : "text-ivory/90"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageToggle />
          <a
            href="tel:2108549095"
            className="flex items-center gap-2 rounded-full border-2 border-gold-warm px-4 py-2 text-sm font-bold text-gold-champagne transition-colors hover:bg-gold-warm hover:text-purple-deep"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call/Text 210-854-9095
          </a>
          <Link
            href="/booking"
            className="rounded-full bg-gold-warm px-5 py-2.5 text-sm font-semibold text-purple-deep transition-colors hover:bg-gold-champagne"
          >
            Schedule Consultation
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <a
            href="tel:2108549095"
            aria-label="Call or text 210-854-9095"
            className="flex items-center justify-center rounded-full border-2 border-gold-warm p-2 text-gold-champagne"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
          </a>
          <button
            className="text-ivory"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="md:hidden overflow-hidden border-t border-gold-warm/20 bg-purple-deep"
          >
            <nav className="flex flex-col gap-1 px-6 py-4" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-3 text-base font-medium text-ivory hover:bg-ivory/5"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:2108549095"
                className="mx-3 flex items-center justify-center gap-2 rounded-full border-2 border-gold-warm py-3 text-base font-bold text-gold-champagne"
              >
                <Phone className="h-4 w-4" /> Call/Text 210-854-9095
              </a>
              <div className="px-3 py-2">
                <LanguageToggle />
              </div>
              <Link
                href="/booking"
                className="mt-2 rounded-full bg-gold-warm px-5 py-3 text-center text-base font-semibold text-purple-deep"
              >
                Schedule Consultation
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
