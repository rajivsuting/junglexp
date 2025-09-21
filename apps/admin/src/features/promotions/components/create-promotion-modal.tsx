"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPromotion } from "@repo/actions/promotions.actions";

// Form validation schema
const createPromotionSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  link: z
    .string()
    .min(1, "Link is required")
    .refine(
      (value) => {
        // Accept paths that start with /
        if (value.startsWith("/")) {
          return true;
        }
        // Accept valid URLs
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Please enter a valid URL or path starting with /",
      }
    ),
  addToActive: z.boolean().default(false),
});

type CreatePromotionFormData = z.infer<typeof createPromotionSchema>;

interface CreatePromotionModalProps {
  onPromotionCreated?: () => void;
}

export function CreatePromotionModal({
  onPromotionCreated,
}: CreatePromotionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreatePromotionFormData>({
    resolver: zodResolver(createPromotionSchema),
    defaultValues: {
      name: "",
      link: "",
      addToActive: true,
    },
  });

  const onSubmit = async (data: CreatePromotionFormData) => {
    setIsLoading(true);
    try {
      await createPromotion({
        name: data.name,
        link: data.link,
        isActive: data.addToActive, // Use the toggle value
      });

      const message = data.addToActive
        ? "Promotion created and added to active list!"
        : "Promotion created successfully!";

      toast.success(message);
      form.reset();
      setIsOpen(false);
      onPromotionCreated?.();
    } catch (error) {
      console.error("Error creating promotion:", error);
      toast.error("Failed to create promotion. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Promotion</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter promotion name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion Link</FormLabel>
                  <FormDescription>
                    For internal paths, use a leading slash (e.g., /promotion)
                    For external URLs, use the full URL (e.g.,
                    https://example.com/promotion)
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/promotion or /internal-path"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addToActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Add to Active List</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Immediately add this promotion to the active promotions
                      list
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Promotion"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
