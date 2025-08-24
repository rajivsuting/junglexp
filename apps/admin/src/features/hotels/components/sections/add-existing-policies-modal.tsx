"use client";

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getPoliciesByKind } from '@repo/actions/policies.actions';

import type { TPolicyBase } from "@repo/db/schema/policies";

interface AddExistingPoliciesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPolicyIds: number[];
  onAddPolicies: (policyIds: number[]) => void;
  kind: "include" | "exclude";
  title: string;
  description: string;
}

export const AddExistingPoliciesModal = ({
  open,
  onOpenChange,
  selectedPolicyIds,
  onAddPolicies,
  kind,
  title,
  description,
}: AddExistingPoliciesModalProps) => {
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
  const [existingPolicies, setExistingPolicies] = useState<TPolicyBase[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load policies when modal opens
  useEffect(() => {
    if (open) {
      const loadPolicies = async () => {
        try {
          setIsLoading(true);
          const policies = await getPoliciesByKind(kind);
          setExistingPolicies(policies);
        } catch (error) {
          console.error("Error loading policies:", error);
          toast.error("Failed to load existing policies");
        } finally {
          setIsLoading(false);
        }
      };

      loadPolicies();
    }
  }, [open, kind]);

  // Filter out policies that are already selected
  const availablePolicies = existingPolicies.filter(
    (policy) => !selectedPolicyIds.includes(policy.id)
  );

  const handlePolicyToggle = (policyId: number, checked: boolean) => {
    if (checked) {
      setTempSelectedIds((prev) => [...prev, policyId]);
    } else {
      setTempSelectedIds((prev) => prev.filter((id) => id !== policyId));
    }
  };

  const handleAddPolicies = () => {
    if (tempSelectedIds.length > 0) {
      onAddPolicies(tempSelectedIds);
      setTempSelectedIds([]);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setTempSelectedIds([]);
    onOpenChange(false);
  };

  // Reset temp selection when modal closes
  useEffect(() => {
    if (!open) {
      setTempSelectedIds([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading policies...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {availablePolicies.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No additional policies available to add.
              </p>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">
                  Select policies to add to your hotel:
                </div>
                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <div className="space-y-3">
                    {availablePolicies.map((policy) => (
                      <div
                        key={policy.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`modal-policy-${policy.id}`}
                          checked={tempSelectedIds.includes(policy.id)}
                          onCheckedChange={(checked) =>
                            handlePolicyToggle(policy.id, !!checked)
                          }
                        />
                        <label
                          htmlFor={`modal-policy-${policy.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                        >
                          {policy.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="text-xs text-muted-foreground">
                  {tempSelectedIds.length} policies selected
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
            onClick={handleAddPolicies}
            disabled={
              tempSelectedIds.length === 0 || availablePolicies.length === 0
            }
          >
            Add {tempSelectedIds.length > 0 ? `${tempSelectedIds.length} ` : ""}
            Policies
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
