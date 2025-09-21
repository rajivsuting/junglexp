"use client";

import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { AmenityManager } from '@/features/hotels/components/sections/amenity-manager';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateRoomAmenities } from '@repo/actions/rooms.actions';

import type { TRoom, TRoomAmenity } from "@repo/db/schema/types";

import type { DisplayAmenity } from "@/features/hotels/components/sections/amenity-manager";

const amenitiesFormSchema = z.object({
  selectedAmenities: z.array(z.number()).default([]),
});

type AmenitiesFormData = z.infer<typeof amenitiesFormSchema>;

interface RoomAmenitiesSectionProps {
  roomId?: string;
  initialData?: TRoom | null;
}

export default function RoomAmenitiesSection({
  roomId,
  initialData,
}: RoomAmenitiesSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialDisplayAmenities = useMemo(
    () =>
      initialData
        ? initialData.amenities.map((amenity: TRoomAmenity) => ({
            id: amenity.id.toString(),
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

  useEffect(() => {
    setDisplayAmenities(initialDisplayAmenities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const form = useForm<AmenitiesFormData>({
    resolver: zodResolver(amenitiesFormSchema),
    defaultValues: {
      selectedAmenities:
        initialData?.amenities.map((amenity: TRoomAmenity) => amenity.id) || [],
    },
  });

  const hasDisplayAmenitiesChanged = useMemo(() => {
    if (initialDisplayAmenities.length !== displayAmenities.length) return true;
    return !initialDisplayAmenities.every((initial, index) => {
      const current = displayAmenities[index];
      return (
        current &&
        initial.amenity.id === current.amenity.id &&
        initial.order === current.order &&
        initial.type === current.type
      );
    });
  }, [initialDisplayAmenities, displayAmenities]);

  const isFormDirty = form.formState.isDirty || hasDisplayAmenitiesChanged;

  const handleSave = async (data: AmenitiesFormData) => {
    if (!roomId) return;
    try {
      setIsSubmitting(true);
      const orderedAmenityIds = displayAmenities
        .sort((a, b) => a.order - b.order)
        .map((da) => da.amenity.id);

      await updateRoomAmenities(Number(roomId), orderedAmenityIds);

      toast.success("Room amenities saved successfully");
    } catch (error) {
      console.error("Error saving room amenities:", error);
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
          title="Room Amenities"
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
}
