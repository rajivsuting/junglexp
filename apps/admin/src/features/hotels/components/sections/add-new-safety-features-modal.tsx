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
import { createSafetyFeatures } from '@repo/actions/safety-features.actions';

import type { TSaftyFeatureBase } from "@repo/db/schema/safty-features";
import type { IconName } from "lucide-react/dynamic";

const newSafetyFeaturesFormSchema = z.object({
  safetyFeatures: z
    .array(
      z.object({
        label: z.string().min(1, "Safety feature name is required"),
        icon: z.string().min(1, "Icon is required"),
      })
    )
    .min(1, "At least one safety feature is required"),
});

type NewSafetyFeaturesFormData = z.infer<typeof newSafetyFeaturesFormSchema>;

interface AddNewSafetyFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSafetyFeaturesCreated: (safetyFeatures: TSaftyFeatureBase[]) => void;
  title: string;
  description: string;
}

export const AddNewSafetyFeaturesModal = ({
  isOpen,
  onClose,
  onSafetyFeaturesCreated,
  title,
  description,
}: AddNewSafetyFeaturesModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewSafetyFeaturesFormData>({
    resolver: zodResolver(newSafetyFeaturesFormSchema),
    defaultValues: {
      safetyFeatures: [{ label: "", icon: "shield" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "safetyFeatures",
  });

  const handleSubmit = async (data: NewSafetyFeaturesFormData) => {
    try {
      setIsSubmitting(true);

      // Create all safety features in parallel
      const createdSafetyFeatures = await createSafetyFeatures(
        data.safetyFeatures.map((safetyFeature) => ({
          label: safetyFeature.label.trim(),
          icon: safetyFeature.icon,
        }))
      );

      if (createdSafetyFeatures.length > 0) {
        onSafetyFeaturesCreated(createdSafetyFeatures);
        toast.success(
          `${createdSafetyFeatures.length} safety features created successfully`
        );

        // Reset form and close modal
        form.reset({ safetyFeatures: [{ label: "", icon: "shield" }] });
        onClose();
      } else {
        toast.error("No valid safety features to create");
      }
    } catch (error) {
      console.error("Error creating safety features:", error);
      toast.error("Failed to create safety features. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset({ safetyFeatures: [{ label: "", icon: "shield" }] });
    onClose();
  };

  const addNewSafetyFeatureField = () => {
    append({ label: "", icon: "shield" });
  };

  const removeSafetyFeatureField = (index: number) => {
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
                Safety Features ({fields.length})
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewSafetyFeatureField}
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Safety Feature
              </Button>
            </div>

            <ScrollArea className="h-[400px] border rounded-md p-4">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Safety Feature {index + 1}
                        </span>
                        {/* Icon preview */}
                        <FormField
                          control={form.control}
                          name={`safetyFeatures.${index}.icon`}
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
                        onClick={() => removeSafetyFeatureField(index)}
                        disabled={isSubmitting || fields.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`safetyFeatures.${index}.label`}
                        render={({ field: inputField }) => (
                          <FormItem>
                            <FormLabel>Safety Feature Name</FormLabel>
                            <FormControl>
                              <Input
                                {...inputField}
                                placeholder={`e.g., '24/7 Security'`}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <IconSelectFormField
                        control={form.control}
                        name={`safetyFeatures.${index}.icon`}
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
              Tip: Press "Add Another Safety Feature" to create multiple safety
              features at once. Each safety feature should have a descriptive
              name and appropriate icon.
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
            {isSubmitting
              ? "Creating..."
              : `Create ${fields.length} Safety Features`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
