"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ListChecks,
  Image as ImageIcon,
  CalendarCheck,
  Mail,
  Search,
  Settings,
  Quote,
  HelpCircle,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Homepage Content", icon: FileText },
  { href: "/admin/services", label: "Services", icon: ListChecks },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
  { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/seo", label: "SEO Settings", icon: Search },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-purple-deep px-4 py-6 md:flex">
      <Link href="/admin" className="mb-8 px-2 font-serif text-lg font-semibold text-ivory">
        Serenity <span className="text-gold-warm">Admin</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-gold-warm text-purple-deep" : "text-ivory/80 hover:bg-ivory/10"
              }`}
            >
              <link.icon className="h-4 w-4" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
