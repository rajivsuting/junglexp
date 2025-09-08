"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AmenityManager } from "@/features/hotels/components/sections/amenity-manager";
import { zodResolver } from "@hookform/resolvers/zod";

import type { DisplayAmenity } from "@/features/hotels/components/sections/amenity-manager";
import type { TActivity, TActivityAmenity } from "@repo/db/index";

const amenitiesFormSchema = z.object({
  selectedAmenities: z.array(z.number()).default([]),
});

type AmenitiesFormData = z.infer<typeof amenitiesFormSchema>;

interface ActivityAmenitiesSectionProps {
  activityId?: number;
  onSave?: (data: AmenitiesFormData) => Promise<void>;
  initialData?: TActivity | null;
}

export const ActivityAmenitiesSection = ({
  activityId,
  onSave,
  initialData,
}: ActivityAmenitiesSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store initial display amenities for comparison
  const initialDisplayAmenities = useMemo(
    () =>
      initialData
        ? initialData.amenities.map((amenity: TActivityAmenity) => ({
            id: amenity.id.toString(), // For DND - use string IDs
            type: "existing" as const,
            amenity: amenity.amenity,
            order: amenity.order,
          }))
        : [],
    [initialData]
  );

  const [displayAmenities, setDisplayAmenities] = useState<DisplayAmenity[]>(
    initialDisplayAmenities
  );

  const form = useForm<AmenitiesFormData>({
    resolver: zodResolver(amenitiesFormSchema),
    defaultValues: {
      selectedAmenities:
        initialData?.amenities.map((amenity: TActivityAmenity) => amenity.id) ||
        [],
    },
  });

  // Check if display amenities have changed
  const hasDisplayAmenitiesChanged = useMemo(() => {
    if (initialDisplayAmenities.length !== displayAmenities.length) {
      return true;
    }

    // Compare each amenity's essential properties
    return !initialDisplayAmenities.every(
      (initial: DisplayAmenity, index: number) => {
        const current = displayAmenities[index];
        return (
          current &&
          initial.amenity.id === current.amenity.id &&
          initial.order === current.order &&
          initial.type === current.type
        );
      }
    );
  }, [initialDisplayAmenities, displayAmenities]);

  // Determine if form should be enabled (either form is dirty or display amenities changed)
  const isFormDirty = form.formState.isDirty || hasDisplayAmenitiesChanged;

  const handleSave = async (data: AmenitiesFormData) => {
    try {
      setIsSubmitting(true);

      // Get ordered amenity IDs based on current display order
      const orderedAmenityIds = displayAmenities
        .sort((a, b) => a.order - b.order)
        .map((da) => da.amenity.id);

      console.log("Saving amenities:", {
        selectedAmenities: data.selectedAmenities,
        orderedAmenityIds,
        displayAmenities,
      });

      console.log("onSave", onSave);

      if (onSave) {
        await onSave(data);
      }

      toast.success("Amenities saved successfully");
    } catch (error) {
      console.error("Error saving amenities:", error);
      toast.error("Failed to save amenities. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmenitiesChange = (amenities: DisplayAmenity[]) => {
    setDisplayAmenities(amenities);
  };

  const handleAmenityIdsChange = (amenityIds: number[]) => {
    form.setValue("selectedAmenities", amenityIds);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        <AmenityManager
          amenities={displayAmenities}
          onAmenitiesChange={handleAmenitiesChange}
          onAmenityIdsChange={handleAmenityIdsChange}
          disabled={isSubmitting}
          title="Activity Amenities"
          createButtonText="Create New Amenities"
          addButtonText="Add Existing Amenities"
          emptyStateText="No amenities selected. Use the buttons above to add amenities."
        />

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || !isFormDirty}
            className="w-full md:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Amenities"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
