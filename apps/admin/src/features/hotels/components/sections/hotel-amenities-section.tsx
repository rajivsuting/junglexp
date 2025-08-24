"use client";

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';

const amenitiesFormSchema = z.object({
  amenities: z.array(z.string()).default([]),
});

type AmenitiesFormData = z.infer<typeof amenitiesFormSchema>;

interface HotelAmenitiesSectionProps {
  initialData?: AmenitiesFormData;
  hotelId?: string;
  onSave?: (data: AmenitiesFormData) => Promise<void>;
}

export const HotelAmenitiesSection = ({
  initialData,
  hotelId,
  onSave,
}: HotelAmenitiesSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AmenitiesFormData>({
    resolver: zodResolver(amenitiesFormSchema),
    defaultValues: {
      amenities: initialData?.amenities || [],
    },
  });

  const handleSave = async (data: AmenitiesFormData) => {
    try {
      setIsSubmitting(true);

      if (onSave) {
        await onSave(data);
      } else {
        // Default save implementation
        console.log("Saving amenities:", data);
      }

      toast.success("Amenities saved successfully");
    } catch (error) {
      console.error("Error saving amenities:", error);
      toast.error("Failed to save amenities. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
        <div className="p-8 text-center text-gray-500">
          Amenities section - Coming soon
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
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
