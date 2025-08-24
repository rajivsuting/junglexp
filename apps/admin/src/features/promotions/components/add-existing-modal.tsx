import { List, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { TPromotionBase } from "@repo/db/schema/promotions";
interface AddExistingModalProps {
  availablePromotions: TPromotionBase[];
  selectedPromotions: number[];
  isModalOpen: boolean;
  onModalOpenChange: (open: boolean) => void;
  onSelectionChange: (promotionId: number, checked: boolean) => void;
  onAddExisting: () => Promise<void>;
  onCancel: () => void;
}

export function AddExistingModal({
  availablePromotions,
  selectedPromotions,
  isModalOpen,
  onModalOpenChange,
  onSelectionChange,
  onAddExisting,
  onCancel,
}: AddExistingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Dialog open={isModalOpen} onOpenChange={onModalOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <List className="h-4 w-4 mr-2" />
          Add Existing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Promotions to Add</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {availablePromotions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <List className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No promotions available</h3>
              <p className="text-muted-foreground text-sm">
                All promotions are already in the active list
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {availablePromotions.map((promotion) => (
                  <Card
                    key={promotion.id}
                    className="transition-colors hover:bg-muted/50 py-0"
                  >
                    <CardContent className="flex items-center space-x-3 p-4">
                      <Checkbox
                        id={`promotion-${promotion.id}`}
                        checked={selectedPromotions.includes(promotion.id)}
                        onCheckedChange={(checked) =>
                          onSelectionChange(promotion.id, !!checked)
                        }
                      />
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium leading-none">
                          {promotion.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {promotion.link}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={() => {
                    setIsLoading(true);
                    onAddExisting().finally(() => {
                      setIsLoading(false);
                    });
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    `Add Selected (${selectedPromotions.length})`
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
