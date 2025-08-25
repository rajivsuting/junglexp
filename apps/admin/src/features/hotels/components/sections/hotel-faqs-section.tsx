"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FaqManager } from "./faq-manager";

import type { DisplayFaq } from "./faq-manager";
import type { THotel, THotelFaq } from "@repo/db/index";

const faqsFormSchema = z.object({
  selectedFaqs: z.array(z.number()).default([]),
});

type FaqsFormData = z.infer<typeof faqsFormSchema>;

interface HotelFaqsSectionProps {
  hotelId?: string;
  onSave?: (data: FaqsFormData) => Promise<void>;
  initialData?: THotel | null;
}

export const HotelFaqsSection = ({
  hotelId,
  onSave,
  initialData,
}: HotelFaqsSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store initial display FAQs for comparison
  const initialDisplayFaqs = useMemo(
    () =>
      initialData
        ? initialData.faqs.map((faq: THotelFaq) => ({
            id: faq.id.toString(), // For DND - use string IDs
            type: "existing" as const,
            faq: faq.faq,
            order: faq.order,
          }))
        : [],
    [initialData]
  );

  const [displayFaqs, setDisplayFaqs] =
    useState<DisplayFaq[]>(initialDisplayFaqs);

  const form = useForm<FaqsFormData>({
    resolver: zodResolver(faqsFormSchema),
    defaultValues: {
      selectedFaqs: initialData?.faqs.map((faq: THotelFaq) => faq.id) || [],
    },
  });

  // Check if display FAQs have changed
  const hasDisplayFaqsChanged = useMemo(() => {
    if (initialDisplayFaqs.length !== displayFaqs.length) {
      return true;
    }

    // Compare each FAQ's essential properties
    return !initialDisplayFaqs.every((initial: DisplayFaq, index: number) => {
      const current = displayFaqs[index];
      return (
        current &&
        initial.faq.id === current.faq.id &&
        initial.order === current.order &&
        initial.type === current.type
      );
    });
  }, [initialDisplayFaqs, displayFaqs]);

  // Determine if form should be enabled (either form is dirty or display FAQs changed)
  const isFormDirty = form.formState.isDirty || hasDisplayFaqsChanged;

  const handleSave = async (data: FaqsFormData) => {
    try {
      setIsSubmitting(true);

      // Get ordered FAQ IDs based on current display order
      const orderedFaqIds = displayFaqs
        .sort((a, b) => a.order - b.order)
        .map((df) => df.faq.id);

      console.log("Saving FAQs:", {
        selectedFaqs: data.selectedFaqs,
        orderedFaqIds,
        displayFaqs,
      });

      if (onSave) {
        await onSave(data);
      }

      toast.success("FAQs saved successfully");
    } catch (error) {
      console.error("Error saving FAQs:", error);
      toast.error("Failed to save FAQs. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFaqsChange = (faqs: DisplayFaq[]) => {
    setDisplayFaqs(faqs);
  };

  const handleFaqIdsChange = (faqIds: number[]) => {
    form.setValue("selectedFaqs", faqIds);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        <FaqManager
          faqs={displayFaqs}
          onFaqsChange={handleFaqsChange}
          onFaqIdsChange={handleFaqIdsChange}
          disabled={isSubmitting}
          title="Hotel FAQs"
          createButtonText="Create New FAQs"
          addButtonText="Add Existing FAQs"
          emptyStateText="No FAQs selected. Use the buttons above to add FAQs."
        />

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || !isFormDirty}
            className="w-full md:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save FAQs"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
