"use client";

import { GripVertical, Plus, PlusCircle, X } from "lucide-react";
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
import { getPoliciesByKind } from "@repo/actions/policies.actions";

import { AddExistingPoliciesModal } from "./add-existing-policies-modal";
import { AddNewPoliciesModal } from "./add-new-policies-modal";

import type { TPolicyBase } from "@repo/db/schema/policies";

// Combined policy type for display and ordering
export type DisplayPolicy = {
  id: string; // For DND - use string IDs
  type: "existing" | "new";
  policy: TPolicyBase;
  order: number;
};

// Sortable Policy Item Component
const SortablePolicyItem = ({
  displayPolicy,
  onRemove,
  disabled,
}: {
  displayPolicy: DisplayPolicy;
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
  } = useSortable({ id: displayPolicy.id });

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
      <div className="flex items-center space-x-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <Badge
          variant={displayPolicy.type === "existing" ? "secondary" : "default"}
        >
          {displayPolicy.type === "existing" ? "Existing" : "New"}
        </Badge>
        <span className="text-sm font-medium">
          {displayPolicy.policy.label}
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(displayPolicy.id)}
        disabled={disabled}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface PolicyManagerProps {
  kind: "include" | "exclude";
  policies: DisplayPolicy[];
  onPoliciesChange: (policies: DisplayPolicy[]) => void;
  onPolicyIdsChange: (policyIds: number[]) => void;
  disabled?: boolean;
  title?: string;
  createButtonText?: string;
  addButtonText?: string;
  emptyStateText?: string;
}

export const PolicyManager = ({
  kind,
  policies,
  onPoliciesChange,
  onPolicyIdsChange,
  disabled = false,
  title = "Policies",
  createButtonText = "Create New Policies",
  addButtonText = "Add Existing Policies",
  emptyStateText = "No policies selected. Use the buttons above to add policies.",
}: PolicyManagerProps) => {
  const [isExistingModalOpen, setIsExistingModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // DND Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddExistingPolicies = (policyIds: number[]) => {
    const fetchPoliciesAndAdd = async () => {
      try {
        const allPolicies = await getPoliciesByKind(kind);
        const policiesToAdd = allPolicies.filter((policy) =>
          policyIds.includes(policy.id)
        );

        // Add to display policies with current max order + 1
        const maxOrder = Math.max(0, ...policies.map((dp) => dp.order));
        const newDisplayPolicies = policiesToAdd.map((policy, index) => ({
          id: `existing-${policy.id}`,
          type: "existing" as const,
          policy,
          order: maxOrder + index + 1,
        }));

        const updatedPolicies = [...policies, ...newDisplayPolicies];
        onPoliciesChange(updatedPolicies);

        // Update policy IDs
        const currentPolicyIds = policies.map((p) => p.policy.id);
        const newPolicyIds = policiesToAdd.map((p) => p.id);
        onPolicyIdsChange([...currentPolicyIds, ...newPolicyIds]);
      } catch (error) {
        console.error("Error fetching policies:", error);
        toast.error("Failed to add policies");
      }
    };

    fetchPoliciesAndAdd();
  };

  const handleNewPoliciesCreated = (newPolicies: TPolicyBase[]) => {
    // Add newly created policies to display
    const maxOrder = Math.max(0, ...policies.map((dp) => dp.order));
    const newDisplayPolicies = newPolicies.map((policy, index) => ({
      id: `new-${policy.id}`,
      type: "new" as const,
      policy,
      order: maxOrder + index + 1,
    }));

    const updatedPolicies = [...policies, ...newDisplayPolicies];
    onPoliciesChange(updatedPolicies);

    // Update policy IDs
    const currentPolicyIds = policies.map((p) => p.policy.id);
    const newPolicyIds = newPolicies.map((p) => p.id);
    onPolicyIdsChange([...currentPolicyIds, ...newPolicyIds]);
  };

  const removeDisplayPolicy = (policyId: string) => {
    const updatedPolicies = policies.filter((dp) => dp.id !== policyId);
    onPoliciesChange(updatedPolicies);

    // Extract numeric ID and update form
    const numericId = parseInt(policyId.split("-")[1] || "0");
    const updatedPolicyIds = policies
      .filter((p) => p.id !== policyId)
      .map((p) => p.policy.id);
    onPolicyIdsChange(updatedPolicyIds);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = policies.findIndex((p) => p.id === active.id);
      const newIndex = policies.findIndex((p) => p.id === over.id);

      const reorderedPolicies = arrayMove(policies, oldIndex, newIndex);

      // Update order values
      const updatedPolicies = reorderedPolicies.map((policy, index) => ({
        ...policy,
        order: index,
      }));

      onPoliciesChange(updatedPolicies);
    }
  };

  // Get current selected policy IDs for the modal
  const selectedPolicyIds = policies.map((p) => p.policy.id);

  return (
    <div className="space-y-6">
      {/* Actions Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            {createButtonText}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsExistingModalOpen(true)}
            disabled={disabled}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {addButtonText}
          </Button>
        </div>
      </div>

      {/* Sortable Policies List */}
      {policies.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {policies.length} policies selected. Drag to reorder.
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={policies.map((dp) => dp.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {policies
                  .sort((a, b) => a.order - b.order)
                  .map((displayPolicy) => (
                    <SortablePolicyItem
                      key={displayPolicy.id}
                      displayPolicy={displayPolicy}
                      onRemove={removeDisplayPolicy}
                      disabled={disabled}
                    />
                  ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>{emptyStateText}</p>
        </div>
      )}

      {/* Add Existing Policies Modal */}
      <AddExistingPoliciesModal
        open={isExistingModalOpen}
        onOpenChange={setIsExistingModalOpen}
        selectedPolicyIds={selectedPolicyIds}
        onAddPolicies={handleAddExistingPolicies}
        kind={kind}
        title={`Add Existing ${kind === "include" ? "Include" : "Exclude"} Policies`}
        description={`Select from previously created ${kind}d policies to add to this hotel.`}
      />

      {/* Add New Policies Modal */}
      <AddNewPoliciesModal
        open={isNewModalOpen}
        onOpenChange={setIsNewModalOpen}
        onPoliciesCreated={handleNewPoliciesCreated}
        kind={kind}
        title={`Create New ${kind === "include" ? "Include" : "Exclude"} Policies`}
        description={`Create multiple new ${kind}d policies for this hotel.`}
      />
    </div>
  );
};
