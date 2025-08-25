"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SafetyFeatureManager } from "./safety-feature-manager";

import type { DisplaySafetyFeature } from "./safety-feature-manager";
import type { THotel, THotelSaftyFeature } from "@repo/db/index";

const safetyFeaturesFormSchema = z.object({
  selectedSafetyFeatures: z.array(z.number()).default([]),
});

type SafetyFeaturesFormData = z.infer<typeof safetyFeaturesFormSchema>;

interface HotelSafetyFeaturesSectionProps {
  hotelId?: string;
  onSave?: (data: SafetyFeaturesFormData) => Promise<void>;
  initialData?: THotel | null;
}

export const HotelSafetyFeaturesSection = ({
  hotelId,
  onSave,
  initialData,
}: HotelSafetyFeaturesSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store initial display safety features for comparison
  const initialDisplaySafetyFeatures = useMemo(
    () =>
      initialData
        ? initialData.saftyFeatures.map(
            (safetyFeature: THotelSaftyFeature) => ({
              id: safetyFeature.id.toString(), // For DND - use string IDs
              type: "existing" as const,
              safetyFeature: safetyFeature.feature,
              order: safetyFeature.order,
            })
          )
        : [],
    [initialData]
  );

  const [displaySafetyFeatures, setDisplaySafetyFeatures] = useState<
    DisplaySafetyFeature[]
  >(initialDisplaySafetyFeatures);

  const form = useForm<SafetyFeaturesFormData>({
    resolver: zodResolver(safetyFeaturesFormSchema),
    defaultValues: {
      selectedSafetyFeatures:
        initialData?.saftyFeatures.map(
          (safetyFeature: THotelSaftyFeature) => safetyFeature.id
        ) || [],
    },
  });

  // Check if display safety features have changed
  const hasDisplaySafetyFeaturesChanged = useMemo(() => {
    if (initialDisplaySafetyFeatures.length !== displaySafetyFeatures.length) {
      return true;
    }

    // Compare each safety feature's essential properties
    return !initialDisplaySafetyFeatures.every(
      (initial: DisplaySafetyFeature, index: number) => {
        const current = displaySafetyFeatures[index];
        return (
          current &&
          initial.safetyFeature.id === current.safetyFeature.id &&
          initial.order === current.order &&
          initial.type === current.type
        );
      }
    );
  }, [initialDisplaySafetyFeatures, displaySafetyFeatures]);

  // Determine if form should be enabled (either form is dirty or display safety features changed)
  const isFormDirty = form.formState.isDirty || hasDisplaySafetyFeaturesChanged;

  const handleSave = async (data: SafetyFeaturesFormData) => {
    try {
      setIsSubmitting(true);

      // Get ordered safety feature IDs based on current display order
      const orderedSafetyFeatureIds = displaySafetyFeatures
        .sort((a, b) => a.order - b.order)
        .map((dsf) => dsf.safetyFeature.id);

      console.log("Saving safety features:", {
        selectedSafetyFeatures: data.selectedSafetyFeatures,
        orderedSafetyFeatureIds,
        displaySafetyFeatures,
      });

      if (onSave) {
        await onSave(data);
      }

      toast.success("Safety features saved successfully");
    } catch (error) {
      console.error("Error saving safety features:", error);
      toast.error("Failed to save safety features. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSafetyFeaturesChange = (
    safetyFeatures: DisplaySafetyFeature[]
  ) => {
    setDisplaySafetyFeatures(safetyFeatures);
  };

  const handleSafetyFeatureIdsChange = (safetyFeatureIds: number[]) => {
    form.setValue("selectedSafetyFeatures", safetyFeatureIds);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        <SafetyFeatureManager
          safetyFeatures={displaySafetyFeatures}
          onSafetyFeaturesChange={handleSafetyFeaturesChange}
          onSafetyFeatureIdsChange={handleSafetyFeatureIdsChange}
          disabled={isSubmitting}
          title="Hotel Safety Features"
          createButtonText="Create New Safety Features"
          addButtonText="Add Existing Safety Features"
          emptyStateText="No safety features selected. Use the buttons above to add safety features."
        />

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || !isFormDirty}
            className="w-full md:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Safety Features"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
