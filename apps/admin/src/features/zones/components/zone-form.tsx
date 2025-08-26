"use client";
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { createZone, updateZone } from '@repo/actions/zones.actions';

import ParksSelect from './park-select';

import type { TZone } from "@repo/db/schema/types";

// --------------------
// Form schema
// --------------------
const formSchema = z.object({
  name: z.string().min(1, "Zone name is required.").max(255),
  description: z.string().min(10, "Description is required."),
  park_id: z.string().refine((value) => value, "Park is required."),
});

type TZoneFormProps = {
  initialData: TZone | null;
  pageTitle: string;
};

const ZoneForm = (props: TZoneFormProps) => {
  const { initialData, pageTitle } = props;
  const router = useRouter();

  // --------------------
  // Default values
  // --------------------
  const defaultValues = useMemo(() => {
    return {
      name: initialData?.name || "",
      description: initialData?.description || "",
      park_id: initialData?.park_id?.toString() ?? "",
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // --------------------
  // Submit: create or update zone
  // --------------------
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsUpdating(true);

      const zonePayload = {
        name: data.name,
        description: data.description,
        park_id: Number(data.park_id),
      };

      if (initialData) {
        // Update existing zone
        await updateZone(initialData.id, zonePayload);
        toast.success("Zone updated successfully");
      } else {
        // Create new zone
        await createZone(zonePayload);
        toast.success("Zone created successfully");
      }

      // Redirect to zones listing
      router.push("/zones");
      router.refresh();
    } catch (error) {
      console.error("Error saving zone:", error);
      toast.error(
        initialData ? "Failed to update zone" : "Failed to create zone"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter zone name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter zone description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="park_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National Park</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
                  >
                    <ParksSelect />
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="animate-spin" />}
              {isUpdating
                ? initialData
                  ? "Updating Zone..."
                  : "Creating Zone..."
                : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ZoneForm;
