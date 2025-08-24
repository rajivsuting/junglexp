"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
	{
		question: "How can I book this accommodation?",
		answer:
			"You can book this property directly through our platform by selecting your dates and completing the reservation process. Payment is secure and you'll receive instant confirmation.",
	},
	{
		question: "What is the check-in and checkout time?",
		answer:
			"The check-in time is 3:00 PM to 9:00 PM while check-out is 11:00 AM. Please ensure you plan your travel accordingly. Early check-in or late checkout may be available upon request and subject to availability.",
	},
	{
		question: "What is included in the booking price?",
		answer:
			"The price includes daily housekeeping, pool maintenance, beach towels, welcome drinks, complimentary WiFi, parking, kitchen essentials, coffee and tea, fresh linens, and 24/7 property manager support.",
	},
	{
		question: "What is the cancellation policy?",
		answer:
			"We offer free cancellation up to 48 hours before your check-in date. Cancellations made within 48 hours may be subject to fees as outlined in our cancellation policy.",
	},
	{
		question: "Are pets allowed in this property?",
		answer:
			"No, pets are not allowed in this property to maintain the comfort and cleanliness for all guests. We appreciate your understanding.",
	},
	{
		question: "What safety features are available?",
		answer:
			"The property is equipped with smoke detectors, carbon monoxide detectors, fire extinguisher, first aid kit, security cameras (exterior only), secure entry, and pool safety equipment.",
	},
	{
		question: "Is there parking available?",
		answer:
			"Yes, free parking is included with your booking. The property provides dedicated parking spaces for guests.",
	},
];

export function FAQSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(1); // Open the second FAQ by default

	const handleToggle = (idx: number) => {
		setOpenIndex(openIndex === idx ? null : idx);
	};

	return (
		<div className="lg:col-span-2 py-6 border-b border-border">
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
		</div>
	);
}
