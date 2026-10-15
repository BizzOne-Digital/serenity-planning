"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export interface ServiceCardData {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  icon?: string;
  benefits?: string[];
}

export default function ServiceCard({
  service,
  index = 0,
  href,
  detailed = false,
}: {
  service: ServiceCardData;
  index?: number;
  /** Adds a descriptive "learn more" link, e.g. to the matching /services section. */
  href?: string;
  /** Shows the full description under the summary (used on the Services page). */
  detailed?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const Icon = ((Icons as unknown as Record<string, LucideIcon>)[service.icon || "HeartHandshake"] ||
    Icons.HeartHandshake) as LucideIcon;

  return (
    <motion.div
      id={service.slug}
      initial={false}
      whileInView={reduceMotion ? { opacity: 1, y: 0 } : { opacity: [0.75, 1], y: [16, 0] }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : Math.min(index * 0.08, 0.4) }}
      className="group flex h-full scroll-mt-28 flex-col rounded-card border border-purple-primary/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-primary/5 text-purple-primary group-hover:bg-gold-warm/15 group-hover:text-gold-warm transition-colors">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-purple-deep">{service.title}</h3>
      <p className={`mt-2 text-sm leading-relaxed text-ink/70 ${detailed ? "" : "flex-1"}`}>{service.shortDescription}</p>
      {detailed && service.fullDescription && (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{service.fullDescription}</p>
      )}
      {service.benefits && service.benefits.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm text-ink/70">
          {service.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <Icons.Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-warm" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
      )}
      {href && (
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-purple-primary hover:text-gold-warm"
        >
          Learn about {service.title.toLowerCase()}
          <Icons.ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </motion.div>
  );
}
