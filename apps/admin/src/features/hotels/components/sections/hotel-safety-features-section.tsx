"use client";

import { GripVertical, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { IconSelect } from '@/components/icon-select';
import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { zodResolver } from '@hookform/resolvers/zod';

import type { DragEndEvent } from "@dnd-kit/core";
import type { IconName } from "lucide-react/dynamic";

// Safety Feature schema
const safetyFeatureSchema = z.object({
  label: z.string().min(1, "Label is required"),
  icon: z.string().min(1, "Icon is required"),
  order: z.number().int().nonnegative(),
});

const safetyFeaturesFormSchema = z.object({
  safetyFeatures: z.array(safetyFeatureSchema).default([]),
});

type SafetyFeaturesFormData = z.infer<typeof safetyFeaturesFormSchema>;

interface HotelSafetyFeaturesSectionProps {
  initialData?: SafetyFeaturesFormData;
  hotelId?: string;
  onSave?: (data: SafetyFeaturesFormData) => Promise<void>;
}

// Sortable Safety Feature Item Component
interface SortableSafetyFeatureItemProps {
  id: string;
  index: number;
  onRemove: () => void;
  form: any;
  disabled?: boolean;
}

const SortableSafetyFeatureItem = ({
  id,
  index,
  onRemove,
  form,
  disabled,
}: SortableSafetyFeatureItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border bg-card p-4 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="mt-2 cursor-grab touch-none"
          {...attributes}
          {...listeners}
          disabled={disabled}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="flex-1 space-y-4">
          <FormField
            control={form.control}
            name={`safetyFeatures.${index}.label`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter safety feature label"
                    {...field}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`safetyFeatures.${index}.icon`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon *</FormLabel>
                <FormControl>
                  <IconSelect
                    selectedIcon={field.value as IconName}
                    onIconSelect={(iconName) => field.onChange(iconName)}
                    placeholder="Select an icon"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                      disabled={disabled}
                    >
                      {field.value ? (
                        <>
                          <span className="mr-2">{field.value}</span>
                          <span className="text-muted-foreground">
                            (Click to change)
                          </span>
                        </>
                      ) : (
                        "Select an icon"
                      )}
                    </Button>
                  </IconSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemove}
          disabled={disabled}
          className="mt-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const HotelSafetyFeaturesSection = ({
  initialData,
  hotelId,
  onSave,
}: HotelSafetyFeaturesSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SafetyFeaturesFormData>({
    resolver: zodResolver(safetyFeaturesFormSchema),
    defaultValues: {
      safetyFeatures: initialData?.safetyFeatures || [],
    },
  });

  const {
    fields: safetyFeatureFields,
    append: appendSafetyFeature,
    remove: removeSafetyFeature,
    move: moveSafetyFeature,
  } = useFieldArray({
    control: form.control,
    name: "safetyFeatures",
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle Safety Feature drag end
  const handleSafetyFeatureDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = safetyFeatureFields.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = safetyFeatureFields.findIndex(
        (item) => item.id === over?.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        moveSafetyFeature(oldIndex, newIndex);

        // Update order values
        const updatedFeatures = arrayMove(
          safetyFeatureFields,
          oldIndex,
          newIndex
        );
        updatedFeatures.forEach((_, index) => {
          form.setValue(`safetyFeatures.${index}.order`, index);
        });
      }
    }
  };

  // Add new Safety Feature
  const addNewSafetyFeature = () => {
    appendSafetyFeature({
      label: "",
      icon: "",
      order: safetyFeatureFields.length,
    });
  };

  const handleSave = async (data: SafetyFeaturesFormData) => {
    try {
      setIsSubmitting(true);

      if (onSave) {
        await onSave(data);
      } else {
        // Default save implementation - you can implement API call here
        console.log("Saving safety features:", data);
      }

      toast.success("Safety features saved successfully");
    } catch (error) {
      console.error("Error saving safety features:", error);
      toast.error("Failed to save safety features. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addNewSafetyFeature}
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Safety Feature
          </Button>
        </div>

        {safetyFeatureFields.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No safety features added yet. Click "Add Safety Feature" to create
            your first safety feature.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSafetyFeatureDragEnd}
          >
            <SortableContext
              items={safetyFeatureFields.map((field) => field.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {safetyFeatureFields.map((field, index) => (
                  <SortableSafetyFeatureItem
                    key={field.id}
                    id={field.id}
                    index={index}
                    onRemove={() => removeSafetyFeature(index)}
                    form={form}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
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
