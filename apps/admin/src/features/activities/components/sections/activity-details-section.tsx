"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createActivity,
  updateActivity,
} from "@repo/actions/activities.actions";
import { getNationalParks } from "@repo/actions/parks.actions";
import { createActivitySchema } from "@repo/db/schema/activities";

import type { TActivityBase, TNewActivity } from "@repo/db";
import type { z } from "zod";

type ActivityFormData = z.infer<typeof createActivitySchema>;

interface ActivityDetailsSectionProps {
  initialData?: Partial<TActivityBase>;
  onSuccess?: () => void;
}

export default function ActivityDetailsSection({
  initialData,
  onSuccess,
}: ActivityDetailsSectionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      park_id: initialData?.park_id || undefined,
    },
  });

  const onSubmit = async (data: ActivityFormData) => {
    try {
      setLoading(true);

      if (initialData?.id) {
        await updateActivity(initialData.id, data);
        toast.success("Activity updated successfully");
      } else {
        const newActivity = await createActivity(data);
        if (newActivity) {
          toast.success("Activity created successfully");
          router.push(`/activites/${newActivity.id}`);
          return;
        }
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving activity:", error);
      toast.error("Failed to save activity");
    } finally {
      setLoading(false);
    }
  };

  const isDirty = form.formState.isDirty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter activity name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter activity description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="park_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>National Park</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a park" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* This would need to be populated with actual parks data */}
                    <SelectItem value="1">Jim Corbett National Park</SelectItem>
                    <SelectItem value="2">Ranthambore National Park</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !isDirty}>
            {loading
              ? "Saving..."
              : initialData?.id
                ? "Update Activity"
                : "Create Activity"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
