"use client";

import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPolicies, createPolicy } from "@repo/actions/policies.actions";

import type { TPolicyBase } from "@repo/db/schema/policies";

const newPoliciesFormSchema = z.object({
  policies: z
    .array(
      z.object({
        label: z.string().min(1, "Policy text is required"),
      })
    )
    .min(1, "At least one policy is required"),
});

type NewPoliciesFormData = z.infer<typeof newPoliciesFormSchema>;

interface AddNewPoliciesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPoliciesCreated: (policies: TPolicyBase[]) => void;
  kind: "include" | "exclude";
  title: string;
  description: string;
}

export const AddNewPoliciesModal = ({
  open,
  onOpenChange,
  onPoliciesCreated,
  kind,
  title,
  description,
}: AddNewPoliciesModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewPoliciesFormData>({
    resolver: zodResolver(newPoliciesFormSchema),
    defaultValues: {
      policies: [{ label: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "policies",
  });

  const handleSubmit = async (data: NewPoliciesFormData) => {
    try {
      setIsSubmitting(true);

      // Create all policies in parallel
      const createdPolicies = await createPolicies(
        data.policies.map((policy, index) => ({
          kind,
          label: policy.label.trim(),
        }))
      );

      if (createdPolicies.length > 0) {
        onPoliciesCreated(createdPolicies);
        toast.success(
          `${createdPolicies.length} policies created successfully`
        );

        // Reset form and close modal
        form.reset({ policies: [{ label: "" }] });
        onOpenChange(false);
      } else {
        toast.error("No valid policies to create");
      }
    } catch (error) {
      console.error("Error creating policies:", error);
      toast.error("Failed to create policies. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset({ policies: [{ label: "" }] });
    onOpenChange(false);
  };

  const addNewPolicyField = () => {
    append({ label: "" });
  };

  const removePolicyField = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Policies ({fields.length})
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewPolicyField}
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Policy
              </Button>
            </div>

            <ScrollArea className="h-[300px] border rounded-md p-4">
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`policies.${index}.label`}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <FormControl>
                              <Input
                                {...inputField}
                                placeholder={`Enter policy ${index + 1} (e.g., 'Free WiFi included')`}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePolicyField(index)}
                            disabled={isSubmitting || fields.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </ScrollArea>

            <div className="text-xs text-muted-foreground">
              Tip: Press "Add Another Policy" to create multiple policies at
              once.
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating..." : `Create ${fields.length} Policies`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
