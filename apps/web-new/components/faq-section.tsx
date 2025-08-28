"use client";

import type { TFaqsBase } from "@repo/db/schema/faqs";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type FAQSectionProps = {
  faqs: TFaqsBase[];
};
export function FAQSection(props: FAQSectionProps) {
  const { faqs } = props;
  const [openIndex, setOpenIndex] = useState<number | null>(1); // Open the second FAQ by default

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="lg:col-span-2 py-6 border-b border-border">
      <h2 className="text-xl font-semibold text-primary mb-6">
        Frequently Asked Questions
      </h2>
      <div className="">
        {faqs.map((faq, idx) => (
          <div
            key={faq.question}
            className={`${idx !== faqs.length - 1 ? "border-b border-b-border" : ""}`}
          >
            <button
              className="w-full flex justify-between items-center text-left py-4 transition-all duration-200 hover:bg-muted/30 focus:outline-none"
              aria-expanded={openIndex === idx}
              aria-controls={`faq-panel-${idx}`}
              onClick={() => handleToggle(idx)}
            >
              <span className="font-medium text-primary pr-4">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                  openIndex === idx ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              id={`faq-panel-${idx}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 pb-4 text-muted-foreground leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
