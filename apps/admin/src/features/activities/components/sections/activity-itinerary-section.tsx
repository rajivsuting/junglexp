"use client";

import { GripVertical, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import {
    closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updateActivityItineraries } from '@repo/actions/activities.actions';

import { AddItineraryModal } from './add-itinerary-modal';

import type { TActivity, TActivityItineraryBase } from "@repo/db/index";

interface ItineraryItem {
  id: string;
  title: string;
  description: string;
  isExisting?: boolean; // Track if this is an existing item from the database
  dbId?: number; // Store the database ID for existing items
}

interface ItineraryFormData {
  itinerary: ItineraryItem[];
}

interface ActivityItinerarySectionProps {
  activityId: number;
  initialData?: TActivity | null;
}

// Sortable Itinerary Item Component
const SortableItineraryItem = ({
  item,
  index,
  onRemove,
  disabled,
}: {
  item: ItineraryItem;
  index: number;
  onRemove: (id: string) => void;
  disabled: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-4 p-4 border rounded-lg"
    >
      <div className="flex flex-col items-center">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mt-2">
          {index + 1}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{item.title}</h4>
          {item.isExisting && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Existing
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
          {item.description}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(item.id)}
        disabled={disabled}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function ActivityItinerarySection({
  activityId,
  initialData,
}: ActivityItinerarySectionProps) {
  // Convert existing itinerary data to our internal format
  const initialItineraryItems: ItineraryItem[] = initialData?.itinerary
    ? initialData.itinerary
        .sort((a, b) => a.order - b.order) // Sort by order
        .map((item: TActivityItineraryBase) => ({
          id: `existing-${item.id}`, // Use existing ID with prefix
          title: item.title,
          description: item.description,
          isExisting: true,
          dbId: item.id,
        }))
    : [];

  const form = useForm<ItineraryFormData>({
    defaultValues: {
      itinerary: initialItineraryItems,
    },
  });

  const {
    watch,
    setValue,
    formState: { isDirty, isSubmitting },
  } = form;
  const itinerary = watch("itinerary");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // DND Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addItineraryItem = (item: { title: string; description: string }) => {
    const newItineraryItem: ItineraryItem = {
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: item.title,
      description: item.description,
      isExisting: false, // Mark as new item
    };
    const updatedItinerary = [...itinerary, newItineraryItem];
    setValue("itinerary", updatedItinerary, { shouldDirty: true });
  };

  const removeItineraryItem = (id: string) => {
    const updatedItinerary = itinerary.filter((item) => item.id !== id);
    setValue("itinerary", updatedItinerary, { shouldDirty: true });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = itinerary.findIndex((item) => item.id === active.id);
      const newIndex = itinerary.findIndex((item) => item.id === over.id);

      const reorderedItinerary = arrayMove(itinerary, oldIndex, newIndex);
      setValue("itinerary", reorderedItinerary, { shouldDirty: true });
    }
  };

  const onSubmit = async (data: ItineraryFormData) => {
    if (!activityId) {
      toast.error("Activity ID is required");
      return;
    }

    if (data.itinerary.length === 0) {
      toast.error("Please add at least one itinerary item");
      return;
    }

    try {
      // Log the current state for debugging
      const existingItems = data.itinerary.filter((item) => item.isExisting);
      const newItems = data.itinerary.filter((item) => !item.isExisting);

      // Convert itinerary items to the format expected by the API (include id and order)
      const itineraryData = data.itinerary.map((item, index) => ({
        id: item.dbId,
        title: item.title,
        description: item.description,
        order: index,
      }));

      const updated = await updateActivityItineraries(
        activityId,
        itineraryData
      );

      // Normalize state from server response to mark all items as existing with db ids
      const updatedItinerary = (
        updated as Array<{
          id: number;
          title: string;
          description: string;
          order: number;
        }>
      )
        .sort((a, b) => a.order - b.order)
        .map((row) => ({
          id: `existing-${row.id}`,
          title: row.title,
          description: row.description,
          isExisting: true,
          dbId: row.id,
        }));

      // Reset form with updated data and mark as not dirty
      form.reset({ itinerary: updatedItinerary });
      setValue("itinerary", updatedItinerary);

      toast.success("Itinerary saved successfully");
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast.error("Failed to save itinerary. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Activity Itinerary</CardTitle>
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            size="sm"
            variant="outline"
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {itinerary.length === 0 ? (
          <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-lg">
            <p className="text-lg font-medium mb-2">No itinerary items yet</p>
            <p className="text-sm">
              Click "Add Item" to create your first itinerary item
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={itinerary.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {itinerary.map((item, index) => (
                  <SortableItineraryItem
                    key={item.id}
                    item={item}
                    index={index}
                    onRemove={removeItineraryItem}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {itinerary.length > 0 && (
          <Button
            type="submit"
            className="w-full"
            disabled={!isDirty || isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Itinerary"}
          </Button>
        )}

        <AddItineraryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addItineraryItem}
        />
      </form>
    </Form>
  );
}
