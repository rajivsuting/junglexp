"use client";

import { GripVertical, Plus, PlusCircle, X } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getAllAmenities } from "@repo/actions/amenities.actions";

import { AddExistingAmenitiesModal } from "./add-existing-amenities-modal";
import { AddNewAmenitiesModal } from "./add-new-amenities-modal";

import type { TAmenityBase } from "@repo/db/schema/amenities";
import type { IconName } from "lucide-react/dynamic";

// Combined amenity type for display and ordering
export type DisplayAmenity = {
  id: string; // For DND - use string IDs
  type: "existing" | "new";
  amenity: TAmenityBase;
  order: number;
};

// Sortable Amenity Item Component
const SortableAmenityItem = ({
  displayAmenity,
  onRemove,
  disabled,
}: {
  displayAmenity: DisplayAmenity;
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
  } = useSortable({ id: displayAmenity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 rounded-md border"
    >
      <div className="flex items-center space-x-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <Badge
          variant={displayAmenity.type === "existing" ? "secondary" : "default"}
        >
          {displayAmenity.type === "existing" ? "Existing" : "New"}
        </Badge>
        <div className="flex items-center space-x-2">
          <DynamicIcon
            name={displayAmenity.amenity.icon as IconName}
            size={16}
            className="text-gray-600"
          />
          <span className="text-sm font-medium">
            {displayAmenity.amenity.label}
          </span>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(displayAmenity.id)}
        disabled={disabled}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface AmenityManagerProps {
  amenities: DisplayAmenity[];
  onAmenitiesChange: (amenities: DisplayAmenity[]) => void;
  onAmenityIdsChange: (amenityIds: number[]) => void;
  disabled?: boolean;
  title?: string;
  createButtonText?: string;
  addButtonText?: string;
  emptyStateText?: string;
}

export const AmenityManager = ({
  amenities,
  onAmenitiesChange,
  onAmenityIdsChange,
  disabled = false,
  title = "Amenities",
  createButtonText = "Create New Amenities",
  addButtonText = "Add Existing Amenities",
  emptyStateText = "No amenities selected. Use the buttons above to add amenities.",
}: AmenityManagerProps) => {
  const [isExistingModalOpen, setIsExistingModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // DND Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddExistingAmenities = (amenityIds: number[]) => {
    const fetchAmenitiesAndAdd = async () => {
      try {
        const allAmenities = await getAllAmenities();
        const amenitiesToAdd = allAmenities.filter((amenity) =>
          amenityIds.includes(amenity.id)
        );

        // Add to display amenities with current max order + 1
        const maxOrder = Math.max(0, ...amenities.map((da) => da.order));
        const newDisplayAmenities = amenitiesToAdd.map((amenity, index) => ({
          id: `existing-${amenity.id}`,
          type: "existing" as const,
          amenity,
          order: maxOrder + index + 1,
        }));

        const updatedAmenities = [...amenities, ...newDisplayAmenities];
        onAmenitiesChange(updatedAmenities);

        // Update amenity IDs
        const currentAmenityIds = amenities.map((a) => a.amenity.id);
        const newAmenityIds = amenitiesToAdd.map((a) => a.id);
        onAmenityIdsChange([...currentAmenityIds, ...newAmenityIds]);
      } catch (error) {
        console.error("Error fetching amenities:", error);
        toast.error("Failed to add amenities");
      }
    };

    fetchAmenitiesAndAdd();
  };

  const handleNewAmenitiesCreated = (newAmenities: TAmenityBase[]) => {
    // Add new amenities to display list
    const maxOrder = Math.max(0, ...amenities.map((da) => da.order));
    const newDisplayAmenities = newAmenities.map((amenity, index) => ({
      id: `new-${Date.now()}-${index}`,
      type: "new" as const,
      amenity,
      order: maxOrder + index + 1,
    }));

    const updatedAmenities = [...amenities, ...newDisplayAmenities];
    onAmenitiesChange(updatedAmenities);

    // Update amenity IDs
    const currentAmenityIds = amenities.map((a) => a.amenity.id);
    const newAmenityIds = newAmenities.map((a) => a.id);
    onAmenityIdsChange([...currentAmenityIds, ...newAmenityIds]);
  };

  const handleRemoveAmenity = (id: string) => {
    const updatedAmenities = amenities.filter((amenity) => amenity.id !== id);
    onAmenitiesChange(updatedAmenities);

    // Update amenity IDs
    const updatedAmenityIds = updatedAmenities.map((a) => a.amenity.id);
    onAmenityIdsChange(updatedAmenityIds);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = amenities.findIndex((item) => item.id === active.id);
      const newIndex = amenities.findIndex((item) => item.id === over.id);

      const newAmenities = arrayMove(amenities, oldIndex, newIndex);

      // Update order values
      const updatedAmenities = newAmenities.map((amenity, index) => ({
        ...amenity,
        order: index + 1,
      }));

      onAmenitiesChange(updatedAmenities);

      // Update amenity IDs in new order
      const orderedAmenityIds = updatedAmenities.map((a) => a.amenity.id);
      onAmenityIdsChange(orderedAmenityIds);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
            disabled={disabled}
          >
            <Plus className="mr-2 h-4 w-4" />
            {createButtonText}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsExistingModalOpen(true)}
            disabled={disabled}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {addButtonText}
          </Button>
        </div>
      </div>

      {amenities.length === 0 ? (
        <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-lg">
          {emptyStateText}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={amenities.map((amenity) => amenity.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {amenities
                .sort((a, b) => a.order - b.order)
                .map((amenity) => (
                  <SortableAmenityItem
                    key={amenity.id}
                    displayAmenity={amenity}
                    onRemove={handleRemoveAmenity}
                    disabled={disabled}
                  />
                ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modals */}
      <AddExistingAmenitiesModal
        isOpen={isExistingModalOpen}
        onClose={() => setIsExistingModalOpen(false)}
        onAddAmenities={handleAddExistingAmenities}
        selectedAmenityIds={amenities.map((a) => a.amenity.id)}
        title="Add Existing Amenities"
        description="Select existing amenities to add to this hotel."
      />

      <AddNewAmenitiesModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAmenitiesCreated={handleNewAmenitiesCreated}
        title="Create New Amenities"
        description="Create new amenities that can be reused across hotels."
      />
    </div>
  );
};
