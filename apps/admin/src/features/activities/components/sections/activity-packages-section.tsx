"use client";

import { GripVertical, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateActivityPackages } from "@repo/actions/activities.actions";

import { AddPackageModal } from "./add-package-modal";

import type { TActivity, TActivityPackageBase } from "@repo/db/index";

interface Package {
  id: string;
  name: string;
  duration: number; // This will be a decimal/float
  number: number;
  price: number;
  price_1: number;
  active: boolean;
  isExisting?: boolean; // Track if this is an existing item from the database
  dbId?: number; // Store the database ID for existing items
}

interface PackagesFormData {
  packages: Package[];
}

interface ActivityPackagesSectionProps {
  activityId: number;
  initialData?: TActivity | null;
}

// Sortable Package Item Component
const SortablePackageItem = ({
  package_,
  index,
  onRemove,
  disabled,
}: {
  package_: Package;
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
  } = useSortable({ id: package_.id });

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
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{package_.name}</h4>
            {package_.isExisting && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Existing
              </span>
            )}
          </div>
          <span
            className={`px-2 py-1 rounded text-xs ${
              package_.active
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {package_.active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
          <div>Duration: {package_.duration}h</div>
          <div>Number: {package_.number}</div>
          <div>Price: ₹{package_.price.toLocaleString()}</div>
          <div>Price 1: ₹{package_.price_1.toLocaleString()}</div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(package_.id)}
        disabled={disabled}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function ActivityPackagesSection({
  activityId,
  initialData,
}: ActivityPackagesSectionProps) {
  // Convert existing package data to our internal format
  const initialPackageItems: Package[] = initialData?.packages
    ? initialData.packages
        .sort((a, b) => a.order - b.order) // Sort by order
        .map((item: TActivityPackageBase) => ({
          id: `existing-${item.id}`, // Use existing ID with prefix
          name: item.name,
          duration: item.duration,
          number: item.number,
          price: item.price,
          price_1: item.price_1,
          active: item.active,
          isExisting: true,
          dbId: item.id,
        }))
    : [];

  const form = useForm<PackagesFormData>({
    defaultValues: {
      packages: initialPackageItems,
    },
  });

  const {
    watch,
    setValue,
    formState: { isDirty, isSubmitting },
  } = form;
  const packages = watch("packages");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // DND Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addPackage = (item: {
    name: string;
    duration: number;
    number: number;
    price: number;
    price_1: number;
    active: boolean;
  }) => {
    const newPackageItem: Package = {
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: item.name,
      duration: item.duration,
      number: item.number,
      price: item.price,
      price_1: item.price_1,
      active: item.active,
      isExisting: false, // Mark as new item
    };
    const updatedPackages = [...packages, newPackageItem];
    setValue("packages", updatedPackages, { shouldDirty: true });
  };

  const removePackage = (id: string) => {
    const updatedPackages = packages.filter((package_) => package_.id !== id);
    setValue("packages", updatedPackages, { shouldDirty: true });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = packages.findIndex(
        (package_) => package_.id === active.id
      );
      const newIndex = packages.findIndex(
        (package_) => package_.id === over.id
      );

      const reorderedPackages = arrayMove(packages, oldIndex, newIndex);
      setValue("packages", reorderedPackages, { shouldDirty: true });
    }
  };

  const onSubmit = async (data: PackagesFormData) => {
    if (!activityId) {
      toast.error("Activity ID is required");
      return;
    }

    try {
      // Log the current state for debugging
      const existingItems = data.packages.filter((item) => item.isExisting);
      const newItems = data.packages.filter((item) => !item.isExisting);

      console.log("Saving packages for activity:", activityId);
      console.log("Existing items:", existingItems);
      console.log("New items:", newItems);
      console.log("Total items:", data.packages.length);

      // Convert package items to the format expected by the API (include id and order)
      const packageData = data.packages.map((item, index) => ({
        id: item.dbId,
        name: item.name,
        duration: item.duration,
        number: item.number,
        price: item.price,
        price_1: item.price_1,
        active: item.active,
        order: index,
      }));

      const updated = await updateActivityPackages(activityId, packageData);

      // Normalize state from server response to mark all items as existing with db ids
      const updatedPackages = (
        updated as Array<{
          id: number;
          name: string;
          duration: number;
          number: number;
          price: number;
          price_1: number;
          active: boolean;
          order: number;
        }>
      )
        .sort((a, b) => a.order - b.order)
        .map((row) => ({
          id: `existing-${row.id}`,
          name: row.name,
          duration: row.duration,
          number: row.number,
          price: row.price,
          price_1: row.price_1,
          active: row.active,
          isExisting: true,
          dbId: row.id,
        }));

      // Reset form with updated data and mark as not dirty
      form.reset({ packages: updatedPackages });
      setValue("packages", updatedPackages);

      toast.success("Packages saved successfully");
    } catch (error) {
      console.error("Error saving packages:", error);
      toast.error("Failed to save packages. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Activity Packages</CardTitle>
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            size="sm"
            variant="outline"
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Package
          </Button>
        </div>

        {packages.length === 0 ? (
          <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-lg">
            <p className="text-lg font-medium mb-2">No packages yet</p>
            <p className="text-sm">
              Click "Add Package" to create your first package
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={packages.map((package_) => package_.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {packages.map((package_, index) => (
                  <SortablePackageItem
                    key={package_.id}
                    package_={package_}
                    index={index}
                    onRemove={removePackage}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting
            ? "Saving..."
            : packages.length > 0
              ? `Save Packages (${packages.length} packages)`
              : "Save Changes"}
        </Button>

        <AddPackageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addPackage}
        />
      </form>
    </Form>
  );
}
