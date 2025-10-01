"use client";

import { GripVertical, List } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
    getActivePromotions, getInactivePromotions, setPromotionActive, setPromotionsActive,
    updatePromotionsOrder
} from '@repo/actions/promotions.actions';

import { AddExistingModal } from './components/add-existing-modal';
import { CreatePromotionModal } from './components/create-promotion-modal';
import { RemoveAlert } from './components/remove-alert';
import { SortableItem } from './components/sortable-item';

import type { DragEndEvent } from "@dnd-kit/core";
import type { TPromotionBase } from "@repo/db/schema/promotions";

export const PromotionsListing = () => {
  const [activePromotions, setActivePromotions] = useState<TPromotionBase[]>(
    []
  );
  const [allPromotions, setAllPromotions] = useState<TPromotionBase[]>([]);
  const [selectedPromotions, setSelectedPromotions] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [removeAlert, setRemoveAlert] = useState<{
    isOpen: boolean;
    promotion: TPromotionBase | null;
  }>({ isOpen: false, promotion: null });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadInactivePromotions = async () => {
    try {
      const inactive = await getInactivePromotions();
      setAllPromotions(inactive);
    } catch (error) {
      toast.error("Failed to load inactive promotions");
      console.error(error);
    }
  };

  const loadPromotions = async () => {
    try {
      setIsLoading(true);
      const [active, all] = await Promise.all([
        getActivePromotions(),
        getInactivePromotions(),
      ]);
      setActivePromotions(active);
      setAllPromotions(all);
    } catch (error) {
      toast.error("Failed to load promotions");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const newItems = [...activePromotions];
      const oldIndex = newItems.findIndex((item) => item.id === active.id);
      const newIndex = newItems.findIndex((item) => item.id === over?.id);

      const reorderedItems = arrayMove(newItems, oldIndex, newIndex);

      // Update state immediately for UI responsiveness
      setActivePromotions(reorderedItems);

      // Update database in background
      try {
        const promotionIds = reorderedItems.map((p) => p.id);

        await updatePromotionsOrder(promotionIds);
        toast.success("Order updated successfully");
      } catch (error) {
        // Revert state on error
        setActivePromotions(activePromotions);
        toast.error("Failed to update order");
        console.error(error);
      }
    }
  };

  const handleRemove = (promotionId: number) => {
    const promotion = activePromotions.find((p) => p.id === promotionId);
    if (promotion) {
      setRemoveAlert({ isOpen: true, promotion });
    }
  };

  const handleConfirmRemove = async () => {
    if (!removeAlert.promotion) return;

    try {
      // Remove from active list
      setActivePromotions((prev) =>
        prev
          .filter((p) => p.id !== removeAlert.promotion!.id)
          .map((p, index) => ({
            ...p,
            order: index + 1,
          }))
      );
      await setPromotionActive(removeAlert.promotion.id, false);
      await loadInactivePromotions();
      toast.success("Promotion removed from active list");
    } catch (error) {
      toast.error("Failed to remove promotion");
      console.error(error);
    } finally {
      setRemoveAlert({ isOpen: false, promotion: null });
    }
  };

  const handleCloseAlert = () => {
    setRemoveAlert({ isOpen: false, promotion: null });
  };

  const handleSelectionChange = (promotionId: number, checked: boolean) => {
    if (checked) {
      setSelectedPromotions((prev) => [...prev, promotionId]);
    } else {
      setSelectedPromotions((prev) => prev.filter((id) => id !== promotionId));
    }
  };

  const handleAddExisting = async () => {
    if (selectedPromotions.length === 0) {
      toast.error("Please select at least one promotion");
      return;
    }

    try {
      // Add selected promotions to active list
      const promotionsToAdd = allPromotions.filter(
        (p) =>
          selectedPromotions.includes(p.id) &&
          !activePromotions.some((ap) => ap.id === p.id)
      );

      await setPromotionsActive(
        promotionsToAdd.map((p) => p.id),
        true
      );
      setActivePromotions((prev) => [
        ...prev,
        ...promotionsToAdd.map((p, index) => ({
          ...p,
          order: prev.length + index + 1,
        })),
      ]);
      setSelectedPromotions([]);
      setIsModalOpen(false);
      toast.success(`Added ${promotionsToAdd.length} promotion(s)`);
      return;
    } catch (error) {
      toast.error("Failed to add promotions");
      console.error(error);
      return;
    }
  };

  const handleCancel = () => {
    setSelectedPromotions([]);
    setIsModalOpen(false);
  };

  const availablePromotions = allPromotions.filter(
    (p) => !activePromotions.some((ap) => ap.id === p.id)
  );

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header with buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
          <p className="text-muted-foreground">
            Manage and organize your promotional content
          </p>
        </div>
        <div className="flex gap-2">
          <CreatePromotionModal onPromotionCreated={loadPromotions} />
          <AddExistingModal
            availablePromotions={availablePromotions}
            selectedPromotions={selectedPromotions}
            isModalOpen={isModalOpen}
            onModalOpenChange={setIsModalOpen}
            onSelectionChange={handleSelectionChange}
            onAddExisting={handleAddExisting}
            onCancel={handleCancel}
          />
        </div>
      </div>

      {/* Active Promotions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GripVertical className="h-5 w-5" />
            Active Promotions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center gap-4 flex-col items-center h-full">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : activePromotions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <List className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                No active promotions
              </h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Create new promotions or add existing ones to get started with
                your promotional content.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={activePromotions.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {activePromotions.map((promotion, index) => (
                      <SortableItem
                        key={promotion.id + "-" + index}
                        id={promotion.id}
                        promotion={promotion}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </CardContent>
      </Card>

      <RemoveAlert
        promotion={removeAlert.promotion}
        isOpen={removeAlert.isOpen}
        onClose={handleCloseAlert}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
};
