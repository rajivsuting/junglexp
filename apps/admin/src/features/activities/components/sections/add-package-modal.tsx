"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PackageItem {
  name: string;
  duration: number; // This will be a decimal/float
  number: number;
  price: number;
  price_1: number;
  active: boolean;
}

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: PackageItem) => void;
}

export const AddPackageModal = ({
  isOpen,
  onClose,
  onAdd,
}: AddPackageModalProps) => {
  const [item, setItem] = useState<PackageItem>({
    name: "",
    duration: 0,
    number: 0,
    price: 0,
    price_1: 0,
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!item.name.trim()) {
      toast.error("Please enter a package name");
      return;
    }

    if (item.duration <= 0) {
      toast.error("Please enter a valid duration (greater than 0)");
      return;
    }

    if (item.price <= 0) {
      toast.error("Please enter a valid price (greater than 0)");
      return;
    }

    try {
      setIsSubmitting(true);
      onAdd(item);
      setItem({
        name: "",
        duration: 0,
        number: 0,
        price: 0,
        price_1: 0,
        active: true,
      });
      onClose();
      toast.success("Package added successfully");
    } catch (error) {
      console.error("Error adding package:", error);
      toast.error("Failed to add package");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setItem({
      name: "",
      duration: 0,
      number: 0,
      price: 0,
      price_1: 0,
      active: true,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Package</DialogTitle>
          <DialogDescription>
            Add a new package for this activity. You can reorder packages after
            adding them.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Package Name</Label>
            <Input
              id="name"
              placeholder="e.g., Standard Package, Premium Package"
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                step="0.5"
                min="0.5"
                placeholder="e.g., 4.5"
                value={item.duration || ""}
                onChange={(e) =>
                  setItem({ ...item, duration: Number(e.target.value) })
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="number">Number</Label>
              <Input
                id="number"
                type="number"
                min="0"
                placeholder="e.g., 10"
                value={item.number || ""}
                onChange={(e) =>
                  setItem({ ...item, number: Number(e.target.value) })
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 1500.00"
                value={item.price || ""}
                onChange={(e) =>
                  setItem({ ...item, price: Number(e.target.value) })
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price_1">Price 1 (₹)</Label>
              <Input
                id="price_1"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 2000.00"
                value={item.price_1 || ""}
                onChange={(e) =>
                  setItem({ ...item, price_1: Number(e.target.value) })
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={item.active}
              onCheckedChange={(checked) =>
                setItem({ ...item, active: !!checked })
              }
              disabled={isSubmitting}
            />
            <Label htmlFor="active" className="text-sm font-medium">
              Active
            </Label>
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
              isSubmitting ||
              !item.name.trim() ||
              item.duration <= 0 ||
              item.price <= 0
            }
          >
            {isSubmitting ? "Adding..." : "Add Package"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
