import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';

import type { TPromotionBase } from "@repo/db/schema/promotions";

interface RemoveAlertProps {
  promotion: TPromotionBase | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RemoveAlert({
  promotion,
  isOpen,
  onClose,
  onConfirm,
}: RemoveAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Promotion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove "{promotion?.name}" from the active
            promotions list? This will make it inactive and it can be added back
            later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
