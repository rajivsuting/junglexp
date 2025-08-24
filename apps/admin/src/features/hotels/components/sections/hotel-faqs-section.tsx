"use client";

import { GripVertical, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

// FAQ schema
const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  order: z.number().int().nonnegative(),
});

const faqsFormSchema = z.object({
  faqs: z.array(faqSchema).default([]),
});

type FaqsFormData = z.infer<typeof faqsFormSchema>;

interface HotelFaqsSectionProps {
  initialData?: FaqsFormData;
  hotelId?: string;
  onSave?: (data: FaqsFormData) => Promise<void>;
}

// Sortable FAQ Item Component
interface SortableFaqItemProps {
  id: string;
  index: number;
  onRemove: () => void;
  form: any;
  disabled?: boolean;
}

const SortableFaqItem = ({
  id,
  index,
  onRemove,
  form,
  disabled,
}: SortableFaqItemProps) => {
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
            name={`faqs.${index}.question`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter FAQ question"
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
            name={`faqs.${index}.answer`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter FAQ answer"
                    className="min-h-[80px]"
                    {...field}
                    disabled={disabled}
                  />
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

export const HotelFaqsSection = ({
  initialData,
  hotelId,
  onSave,
}: HotelFaqsSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FaqsFormData>({
    resolver: zodResolver(faqsFormSchema),
    defaultValues: {
      faqs: initialData?.faqs || [],
    },
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
    move: moveFaq,
  } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle FAQ drag end
  const handleFaqDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = faqFields.findIndex((item) => item.id === active.id);
      const newIndex = faqFields.findIndex((item) => item.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        moveFaq(oldIndex, newIndex);

        // Update order values
        const updatedFaqs = arrayMove(faqFields, oldIndex, newIndex);
        updatedFaqs.forEach((_, index) => {
          form.setValue(`faqs.${index}.order`, index);
        });
      }
    }
  };

  // Add new FAQ
  const addNewFaq = () => {
    appendFaq({
      question: "",
      answer: "",
      order: faqFields.length,
    });
  };

  const handleSave = async (data: FaqsFormData) => {
    try {
      setIsSubmitting(true);

      if (onSave) {
        await onSave(data);
      } else {
        // Default save implementation - you can implement API call here
        console.log("Saving FAQs:", data);
      }

      toast.success("FAQs saved successfully");
    } catch (error) {
      console.error("Error saving FAQs:", error);
      toast.error("Failed to save FAQs. Please try again.");
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
            onClick={addNewFaq}
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
        </div>

        {faqFields.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No FAQs added yet. Click "Add FAQ" to create your first FAQ.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleFaqDragEnd}
          >
            <SortableContext
              items={faqFields.map((field) => field.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {faqFields.map((field, index) => (
                  <SortableFaqItem
                    key={field.id}
                    id={field.id}
                    index={index}
                    onRemove={() => removeFaq(index)}
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
            {isSubmitting ? "Saving..." : "Save FAQs"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
