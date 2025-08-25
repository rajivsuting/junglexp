"use client";

import { GripVertical, Plus, PlusCircle, X } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getAllSafetyFeatures } from '@repo/actions/safety-features.actions';

import { AddExistingSafetyFeaturesModal } from './add-existing-safety-features-modal';
import { AddNewSafetyFeaturesModal } from './add-new-safety-features-modal';

import type { TSaftyFeatureBase } from "@repo/db/schema/safty-features";
import type { IconName } from "lucide-react/dynamic";

// Combined safety feature type for display and ordering
export type DisplaySafetyFeature = {
  id: string; // For DND - use string IDs
  type: "existing" | "new";
  safetyFeature: TSaftyFeatureBase;
  order: number;
};

// Sortable Safety Feature Item Component
const SortableSafetyFeatureItem = ({
  displaySafetyFeature,
  onRemove,
  disabled,
}: {
  displaySafetyFeature: DisplaySafetyFeature;
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
  } = useSortable({ id: displaySafetyFeature.id });

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
          variant={
            displaySafetyFeature.type === "existing" ? "secondary" : "default"
          }
        >
          {displaySafetyFeature.type === "existing" ? "Existing" : "New"}
        </Badge>
        <div className="flex items-center space-x-2">
          <DynamicIcon
            name={displaySafetyFeature.safetyFeature.icon as IconName}
            size={16}
            className="text-gray-600"
          />
          <span className="text-sm font-medium">
            {displaySafetyFeature.safetyFeature.label}
          </span>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(displaySafetyFeature.id)}
        disabled={disabled}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface SafetyFeatureManagerProps {
  safetyFeatures: DisplaySafetyFeature[];
  onSafetyFeaturesChange: (safetyFeatures: DisplaySafetyFeature[]) => void;
  onSafetyFeatureIdsChange: (safetyFeatureIds: number[]) => void;
  disabled?: boolean;
  title?: string;
  createButtonText?: string;
  addButtonText?: string;
  emptyStateText?: string;
}

export const SafetyFeatureManager = ({
  safetyFeatures,
  onSafetyFeaturesChange,
  onSafetyFeatureIdsChange,
  disabled = false,
  title = "Safety Features",
  createButtonText = "Create New Safety Features",
  addButtonText = "Add Existing Safety Features",
  emptyStateText = "No safety features selected. Use the buttons above to add safety features.",
}: SafetyFeatureManagerProps) => {
  const [isExistingModalOpen, setIsExistingModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // DND Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddExistingSafetyFeatures = (safetyFeatureIds: number[]) => {
    const fetchSafetyFeaturesAndAdd = async () => {
      try {
        const allSafetyFeatures = await getAllSafetyFeatures();
        const safetyFeaturesToAdd = allSafetyFeatures.filter((safetyFeature) =>
          safetyFeatureIds.includes(safetyFeature.id)
        );

        // Add to display safety features with current max order + 1
        const maxOrder = Math.max(0, ...safetyFeatures.map((dsf) => dsf.order));
        const newDisplaySafetyFeatures = safetyFeaturesToAdd.map(
          (safetyFeature, index) => ({
            id: `existing-${safetyFeature.id}`,
            type: "existing" as const,
            safetyFeature,
            order: maxOrder + index + 1,
          })
        );

        const updatedSafetyFeatures = [
          ...safetyFeatures,
          ...newDisplaySafetyFeatures,
        ];
        onSafetyFeaturesChange(updatedSafetyFeatures);

        // Update safety feature IDs
        const currentSafetyFeatureIds = safetyFeatures.map(
          (sf) => sf.safetyFeature.id
        );
        const newSafetyFeatureIds = safetyFeaturesToAdd.map((sf) => sf.id);
        onSafetyFeatureIdsChange([
          ...currentSafetyFeatureIds,
          ...newSafetyFeatureIds,
        ]);
      } catch (error) {
        console.error("Error fetching safety features:", error);
        toast.error("Failed to add safety features");
      }
    };

    fetchSafetyFeaturesAndAdd();
  };

  const handleNewSafetyFeaturesCreated = (
    newSafetyFeatures: TSaftyFeatureBase[]
  ) => {
    // Add new safety features to display list
    const maxOrder = Math.max(0, ...safetyFeatures.map((dsf) => dsf.order));
    const newDisplaySafetyFeatures = newSafetyFeatures.map(
      (safetyFeature, index) => ({
        id: `new-${Date.now()}-${index}`,
        type: "new" as const,
        safetyFeature,
        order: maxOrder + index + 1,
      })
    );

    const updatedSafetyFeatures = [
      ...safetyFeatures,
      ...newDisplaySafetyFeatures,
    ];
    onSafetyFeaturesChange(updatedSafetyFeatures);

    // Update safety feature IDs
    const currentSafetyFeatureIds = safetyFeatures.map(
      (sf) => sf.safetyFeature.id
    );
    const newSafetyFeatureIds = newSafetyFeatures.map((sf) => sf.id);
    onSafetyFeatureIdsChange([
      ...currentSafetyFeatureIds,
      ...newSafetyFeatureIds,
    ]);
  };

  const handleRemoveSafetyFeature = (id: string) => {
    const updatedSafetyFeatures = safetyFeatures.filter(
      (safetyFeature) => safetyFeature.id !== id
    );
    onSafetyFeaturesChange(updatedSafetyFeatures);

    // Update safety feature IDs
    const updatedSafetyFeatureIds = updatedSafetyFeatures.map(
      (sf) => sf.safetyFeature.id
    );
    onSafetyFeatureIdsChange(updatedSafetyFeatureIds);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = safetyFeatures.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = safetyFeatures.findIndex((item) => item.id === over.id);

      const newSafetyFeatures = arrayMove(safetyFeatures, oldIndex, newIndex);

      // Update order values
      const updatedSafetyFeatures = newSafetyFeatures.map(
        (safetyFeature, index) => ({
          ...safetyFeature,
          order: index + 1,
        })
      );

      onSafetyFeaturesChange(updatedSafetyFeatures);

      // Update safety feature IDs in new order
      const orderedSafetyFeatureIds = updatedSafetyFeatures.map(
        (sf) => sf.safetyFeature.id
      );
      onSafetyFeatureIdsChange(orderedSafetyFeatureIds);
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

      {safetyFeatures.length === 0 ? (
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
            items={safetyFeatures.map((safetyFeature) => safetyFeature.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {safetyFeatures
                .sort((a, b) => a.order - b.order)
                .map((safetyFeature) => (
                  <SortableSafetyFeatureItem
                    key={safetyFeature.id}
                    displaySafetyFeature={safetyFeature}
                    onRemove={handleRemoveSafetyFeature}
                    disabled={disabled}
                  />
                ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modals */}
      <AddExistingSafetyFeaturesModal
        isOpen={isExistingModalOpen}
        onClose={() => setIsExistingModalOpen(false)}
        onAddSafetyFeatures={handleAddExistingSafetyFeatures}
        selectedSafetyFeatureIds={safetyFeatures.map(
          (sf) => sf.safetyFeature.id
        )}
        title="Add Existing Safety Features"
        description="Select existing safety features to add to this hotel."
      />

      <AddNewSafetyFeaturesModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSafetyFeaturesCreated={handleNewSafetyFeaturesCreated}
        title="Create New Safety Features"
        description="Create new safety features that can be reused across hotels."
      />
    </div>
  );
};
