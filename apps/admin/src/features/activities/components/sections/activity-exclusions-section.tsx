"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PolicyManager } from "../../../hotels/components/sections/policy-manager";

import type { DisplayPolicy } from "../../../hotels/components/sections/policy-manager";
import type { TActivity } from "@repo/db/index";

const exclusionsFormSchema = z.object({
  selectedPolicies: z.array(z.number()).default([]),
});

type ExclusionsFormData = z.infer<typeof exclusionsFormSchema>;

interface ActivityExclusionsSectionProps {
  activityId?: string;
  onSave?: (data: ExclusionsFormData) => Promise<void>;
  initialData?: TActivity | null;
}

export const ActivityExclusionsSection = ({
  activityId,
  onSave,
  initialData,
}: ActivityExclusionsSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store initial display policies for comparison
  const initialDisplayPolicies = useMemo(
    () =>
      initialData
        ? initialData.policies
            .filter((policy) => policy.policy.kind === "exclude")
            .map((policy) => ({
              id: policy.id.toString(), // For DND - use string IDs
              type: "existing" as const,
              policy: policy.policy,
              order: policy.order,
            }))
        : [],
    [initialData]
  );
  const [displayPolicies, setDisplayPolicies] = useState<DisplayPolicy[]>(
    initialDisplayPolicies
  );

  const form = useForm<ExclusionsFormData>({
    resolver: zodResolver(exclusionsFormSchema),
    defaultValues: {
      selectedPolicies:
        initialDisplayPolicies.map((policy) => Number(policy.id)) || [],
    },
  });

  // Check if display policies have changed
  const hasDisplayPoliciesChanged = useMemo(() => {
    if (initialDisplayPolicies.length !== displayPolicies.length) {
      return true;
    }

    // Compare each policy's essential properties
    return !initialDisplayPolicies.every((initial: any, index: number) => {
      const current = displayPolicies[index];
      return (
        current &&
        initial.policy.id === current.policy.id &&
        initial.order === current.order &&
        initial.type === current.type
      );
    });
  }, [initialDisplayPolicies, displayPolicies]);

  // Determine if form should be enabled (either form is dirty or display policies changed)
  const isFormDirty = form.formState.isDirty || hasDisplayPoliciesChanged;

  const handleSave = async (data: ExclusionsFormData) => {
    try {
      setIsSubmitting(true);

      // Get ordered policy IDs based on current display order
      const orderedPolicyIds = displayPolicies
        .sort((a, b) => a.order - b.order)
        .map((dp) => dp.policy.id);

      console.log("Saving exclusions:", {
        selectedPolicies: data.selectedPolicies,
        orderedPolicyIds,
        displayPolicies,
      });

      if (onSave) {
        await onSave(data);
      }

      toast.success("Exclusions saved successfully");
    } catch (error) {
      console.error("Error saving exclusions:", error);
      toast.error("Failed to save exclusions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePoliciesChange = (policies: DisplayPolicy[]) => {
    setDisplayPolicies(policies);
  };

  const handlePolicyIdsChange = (policyIds: number[]) => {
    form.setValue("selectedPolicies", policyIds);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        <PolicyManager
          kind="exclude"
          policies={displayPolicies}
          onPoliciesChange={handlePoliciesChange}
          onPolicyIdsChange={handlePolicyIdsChange}
          disabled={isSubmitting}
          title="Exclude Policies"
          createButtonText="Create New Policies"
          addButtonText="Add Existing Policies"
          emptyStateText="No exclusion policies selected. Use the buttons above to add policies."
        />

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || !isFormDirty}
            className="w-full md:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Exclusions"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
