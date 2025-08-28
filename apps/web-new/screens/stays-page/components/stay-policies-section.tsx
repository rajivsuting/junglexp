"use client";
import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import type { THotelPolicy } from "@repo/db/index";
import type { FC } from "react";

type StayPoliciesSectionProps = {
  policies: THotelPolicy[];
  kind: "include" | "exclude";
};

export const StayPoliciesSection: FC<StayPoliciesSectionProps> = (props) => {
  const { policies, kind } = props;
  const [showIncluded, setShowIncluded] = useState(false);

  return (
    <section className="py-6 border-b border-border transition-all duration-300">
      <button
        onClick={() => setShowIncluded(!showIncluded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="text-xl font-semibold text-primary">
          {kind === "include" ? "What's included" : "What's not included"}
        </h2>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            showIncluded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-3",
          showIncluded ? "max-h-96 opacity-100 pt-4" : "max-h-0 opacity-0"
        )}
      >
        {policies.map((item, index) => (
          <div key={index} className="flex items-center gap-3 text-primary">
            {kind === "include" ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
            <span>{item.policy.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
