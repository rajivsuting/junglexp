"use client";

import { Loader2, Plus, X } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { IconSelectFormField } from '@/components/icon-select';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAmenities } from '@repo/actions/amenities.actions';

import type { TAmenityBase } from "@repo/db/schema/amenities";
import type { IconName } from "lucide-react/dynamic";

const newAmenitiesFormSchema = z.object({
  amenities: z
    .array(
      z.object({
        label: z.string().min(1, "Amenity name is required"),
        icon: z.string().min(1, "Icon is required"),
      })
    )
    .min(1, "At least one amenity is required"),
});

type NewAmenitiesFormData = z.infer<typeof newAmenitiesFormSchema>;

interface AddNewAmenitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAmenitiesCreated: (amenities: TAmenityBase[]) => void;
  title: string;
  description: string;
}

export const AddNewAmenitiesModal = ({
  isOpen,
  onClose,
  onAmenitiesCreated,
  title,
  description,
}: AddNewAmenitiesModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewAmenitiesFormData>({
    resolver: zodResolver(newAmenitiesFormSchema),
    defaultValues: {
      amenities: [{ label: "", icon: "wifi" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "amenities",
  });

  const handleSubmit = async (data: NewAmenitiesFormData) => {
    try {
      setIsSubmitting(true);

      // Create all amenities in parallel
      const createdAmenities = await createAmenities(
        data.amenities.map((amenity) => ({
          label: amenity.label.trim(),
          icon: amenity.icon,
        }))
      );

      if (createdAmenities.length > 0) {
        onAmenitiesCreated(createdAmenities);
        toast.success(
          `${createdAmenities.length} amenities created successfully`
        );

        // Reset form and close modal
        form.reset({ amenities: [{ label: "", icon: "wifi" }] });
        onClose();
      } else {
        toast.error("No valid amenities to create");
      }
    } catch (error) {
      console.error("Error creating amenities:", error);
      toast.error("Failed to create amenities. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset({ amenities: [{ label: "", icon: "wifi" }] });
    onClose();
  };

  const addNewAmenityField = () => {
    append({ label: "", icon: "wifi" });
  };

  const removeAmenityField = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Amenities ({fields.length})
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewAmenityField}
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Amenity
              </Button>
            </div>

            <ScrollArea className="h-[400px] border rounded-md p-4">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Amenity {index + 1}
                        </span>
                        {/* Icon preview */}
                        <FormField
                          control={form.control}
                          name={`amenities.${index}.icon`}
                          render={({ field: iconField }) => (
                            <div className="flex items-center space-x-1">
                              {iconField.value && (
                                <DynamicIcon
                                  name={iconField.value as IconName}
                                  size={14}
                                  className="text-gray-600"
                                />
                              )}
                            </div>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAmenityField(index)}
                        disabled={isSubmitting || fields.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`amenities.${index}.label`}
                        render={({ field: inputField }) => (
                          <FormItem>
                            <FormLabel>Amenity Name</FormLabel>
                            <FormControl>
                              <Input
                                {...inputField}
                                placeholder={`e.g., 'Free WiFi'`}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <IconSelectFormField
                        control={form.control}
                        name={`amenities.${index}.icon`}
                        label="Icon"
                        placeholder="Select an icon"
                        searchPlaceholder="Search for icons..."
                        variant="outline"
                        size="default"
                      />
                    </div>

                    {index < fields.length - 1 && (
                      <hr className="border-border" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="text-xs text-muted-foreground">
              Tip: Press "Add Another Amenity" to create multiple amenities at
              once. Each amenity should have a descriptive name and appropriate
              icon.
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating..." : `Create ${fields.length} Amenities`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
