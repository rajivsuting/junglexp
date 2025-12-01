"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ItineraryItemData {
  title: string;
  description: string;
}

interface AddItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ItineraryItemData) => void;
  initialData?: ItineraryItemData | null;
}

export const AddItineraryModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddItineraryModalProps) => {
  const [item, setItem] = useState<ItineraryItemData>({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setItem(initialData);
      } else {
        setItem({ title: "", description: "" });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async () => {
    if (!item.title.trim()) {
      toast.error("Please enter a title for the itinerary item");
      return;
    }

    if (!item.description.trim()) {
      toast.error("Please enter a description for the itinerary item");
      return;
    }

    try {
      setIsSubmitting(true);
      onSave(item);
      if (!initialData) {
        setItem({ title: "", description: "" });
      }
      onClose();
      toast.success(
        initialData
          ? "Itinerary item updated"
          : "Itinerary item added successfully"
      );
    } catch (error) {
      console.error("Error saving itinerary item:", error);
      toast.error("Failed to save itinerary item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setItem({ title: "", description: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Itinerary Item" : "Add Itinerary Item"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Edit the details of your itinerary item."
              : "Add a new item to the activity itinerary. You can reorder items after adding them."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Morning Safari, Lunch Break, Evening Tour"
              value={item.title}
              onChange={(e) => setItem({ ...item, title: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2 max-h-[50vh] overflow-y-auto">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what happens during this part of the itinerary..."
              value={item.description}
              onChange={(e) =>
                setItem({ ...item, description: e.target.value })
              }
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting || !item.title.trim() || !item.description.trim()
            }
          >
            {isSubmitting
              ? "Saving..."
              : initialData
                ? "Save Changes"
                : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
