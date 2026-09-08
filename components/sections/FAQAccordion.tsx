"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  _id?: string;
  question: string;
  answer: string;
}

export default function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) {
    return <p className="text-center text-ink/60">FAQs coming soon.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl divide-y divide-purple-primary/10 rounded-card border border-purple-primary/10 bg-white">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;
        return (
          <div key={faq._id || faq.question}>
            <h3>
              <button
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-medium text-purple-deep">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gold-warm transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-6 pb-5 text-sm leading-relaxed text-ink/70"
            >
              {faq.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
