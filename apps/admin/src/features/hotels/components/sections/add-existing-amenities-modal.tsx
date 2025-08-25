"use client";

import { Loader2 } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllAmenities } from "@repo/actions/amenities.actions";

import type { TAmenityBase } from "@repo/db/schema/amenities";
import type { IconName } from "lucide-react/dynamic";

interface AddExistingAmenitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAmenityIds: number[];
  onAddAmenities: (amenityIds: number[]) => void;
  title: string;
  description: string;
}

export const AddExistingAmenitiesModal = ({
  isOpen,
  onClose,
  selectedAmenityIds,
  onAddAmenities,
  title,
  description,
}: AddExistingAmenitiesModalProps) => {
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
  const [existingAmenities, setExistingAmenities] = useState<TAmenityBase[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  // Load amenities when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadAmenities = async () => {
        try {
          setIsLoading(true);
          const amenities = await getAllAmenities();
          setExistingAmenities(amenities);
        } catch (error) {
          console.error("Error loading amenities:", error);
          toast.error("Failed to load existing amenities");
        } finally {
          setIsLoading(false);
        }
      };

      loadAmenities();
    }
  }, [isOpen]);

  // Filter out amenities that are already selected
  const availableAmenities = existingAmenities.filter(
    (amenity) => !selectedAmenityIds.includes(amenity.id)
  );

  const handleAmenityToggle = (amenityId: number, checked: boolean) => {
    if (checked) {
      setTempSelectedIds((prev) => [...prev, amenityId]);
    } else {
      setTempSelectedIds((prev) => prev.filter((id) => id !== amenityId));
    }
  };

  const handleAddAmenities = () => {
    if (tempSelectedIds.length > 0) {
      onAddAmenities(tempSelectedIds);
      setTempSelectedIds([]);
      onClose();
    }
  };

  const handleCancel = () => {
    setTempSelectedIds([]);
    onClose();
  };

  // Reset temp selection when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTempSelectedIds([]);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading amenities...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {availableAmenities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No additional amenities available to add.
              </p>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">
                  Select amenities to add to your hotel:
                </div>
                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <div className="space-y-3">
                    {availableAmenities.map((amenity) => (
                      <div
                        key={amenity.id}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={`modal-amenity-${amenity.id}`}
                          checked={tempSelectedIds.includes(amenity.id)}
                          onCheckedChange={(checked) =>
                            handleAmenityToggle(amenity.id, !!checked)
                          }
                        />
                        <div className="flex items-center space-x-2 flex-1">
                          <DynamicIcon
                            name={amenity.icon as IconName}
                            size={16}
                            className="text-gray-600"
                          />
                          <label
                            htmlFor={`modal-amenity-${amenity.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {amenity.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="text-xs text-muted-foreground">
                  {tempSelectedIds.length} amenities selected
                </div>
              </>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleAddAmenities}
            disabled={
              tempSelectedIds.length === 0 || availableAmenities.length === 0
            }
          >
            Add {tempSelectedIds.length > 0 ? `${tempSelectedIds.length} ` : ""}
            Amenities
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
