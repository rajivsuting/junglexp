"use client";

import { useState } from 'react';

const faqs = [
  {
    question: "How can I book Corbett National Park Tour Resort?",
    answer: "",
  },
  {
    question: "What is the check-in and checkout time for resort?",
    answer:
      "The check-in time for resort is 1:00 pm to 2:00 pm while check out is 11:00 am. Ensure you are making your travel plans accordingly. Early Check-in Or Late Checkout is Subject to Availability.",
  },
  {
    question: "What is the cost of Corbett National Park Tour Package?",
    answer: "",
  },
  {
    question:
      "Do all resorts in Corbett National Park Tour are at Riverside Location?",
    answer: "",
  },
  {
    question: "Does Pets Allowed In Corbett National Park Tour Resorts?",
    answer: "",
  },
  {
    question: "Which is the best resort in Corbett National Park Tour?",
    answer: "",
  },
  {
    question: "Is there any resort inside Corbett National Park?",
    answer: "",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(1); // Open the second FAQ by default

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            FAQ Related to Corbett National Park Tour Resorts
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find Answers to Your Questions and Plan Your Perfect Corbett
            National Park Tour with Ease.
          </p>
        </div>
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <div
              key={faq.question}
              className="bg-gray-50 rounded-xl border p-6 transition-shadow shadow-sm"
            >
              <button
                className="w-full flex justify-between items-center text-left focus:outline-none"
                aria-expanded={openIndex === idx}
                aria-controls={`faq-panel-${idx}`}
                onClick={() => handleToggle(idx)}
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <span className="ml-4 text-2xl text-gray-400">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>
              {openIndex === idx && faq.answer && (
                <div
                  id={`faq-panel-${idx}`}
                  className="mt-4 text-muted-foreground text-base animate-fade-in"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
