import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-purple-deep text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Serenity Planning" className="h-20 w-auto" />
            <p className="mt-3 text-sm text-ivory/70 leading-relaxed">
              Compassionate, pressure-free pre-need funeral and cremation planning for San Antonio families.
            </p>
            <p className="mt-4 text-sm italic text-gold-champagne">Plan Today. Peace Tomorrow.</p>
            <p className="mt-1 text-xs text-ivory/60">Your Wishes. Our Commitment. Their Peace of Mind.</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold-warm">Navigation</h3>
            <ul className="space-y-2 text-sm text-ivory/80">
              <li><Link href="/" className="hover:text-gold-warm">Home</Link></li>
              <li><Link href="/about" className="hover:text-gold-warm">About</Link></li>
              <li><Link href="/services" className="hover:text-gold-warm">Services</Link></li>
              <li><Link href="/contact" className="hover:text-gold-warm">Contact</Link></li>
              <li><Link href="/booking" className="hover:text-gold-warm">Book a Consultation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold-warm">Planning Services</h3>
            <ul className="space-y-2 text-sm text-ivory/80">
              <li>Pre-Need Funeral Planning</li>
              <li>Burial Pre-Need Plans</li>
              <li>Cremation Pre-Need Plans</li>
              <li>Memorial Service Planning</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold-warm">Contact</h3>
            <ul className="space-y-2 text-sm text-ivory/80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold-warm" aria-hidden="true" />
                <a href="tel:2108549095" className="hover:text-gold-warm">210-854-9095</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold-warm" aria-hidden="true" />
                <a href="mailto:Serenityplanning210@gmail.com" className="hover:text-gold-warm break-all">
                  Serenityplanning210@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold-warm" aria-hidden="true" />
                San Antonio, TX
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Facebook" className="text-ivory/70 hover:text-gold-warm">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-ivory/70 hover:text-gold-warm">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-ivory/10 pt-6 text-xs leading-relaxed text-ivory/50">
          <p>
            Services, plans, payment options, pricing, inclusions and availability may vary by funeral
            provider and applicable state requirements. Information provided on this website is for
            general informational purposes and does not constitute legal, financial or insurance advice.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p>&copy; {year} Serenity Planning. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:text-gold-warm">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gold-warm">Terms</Link>
              <Link href="/disclaimer" className="hover:text-gold-warm">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
