"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FileUploader, hasValidImages } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import NationalParkSelect from "@/features/souvenirs/components/park-select";
import { ImagesArraySchema } from "@/lib/image-schema";
import { uploadFilesWithProgress } from "@/lib/upload-files";
import { zodResolver } from "@hookform/resolvers/zod";
import { getActivities } from "@repo/actions/activities.actions";
import { createImages } from "@repo/actions/image.actions";
import {
  createNaturalist,
  updateNaturalist,
} from "@repo/actions/naturlists.actions";
import { MAX_FILE_SIZE } from "@repo/db/utils/file-utils";

import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";
import type { TNaturalistBase } from "@repo/db/schema/naturalist";
import type { TNewImage } from "@repo/db/schema/image";
import type { Option } from "@/components/ui/multi-select";

type Props = {
  initialData:
    | (TNaturalistBase & {
        image?: any;
        naturalistActivities?: Array<{
          activity?: { id: number; name: string };
        }>;
      })
    | null;
  pageTitle: string;
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().min(1, "Description is required"),
  park_id: z.string().min(1, "National Park is required"),
  activity_ids: z.array(z.string()).default([]),
  images: ImagesArraySchema(1, 5).default([]),
});

const NaturalistForm = ({ initialData, pageTitle }: Props) => {
  const router = useRouter();
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activities, setActivities] = useState<Option[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  const defaultValues = useMemo(() => {
    const activityIds =
      initialData?.naturalistActivities
        ?.map((na) => String(na.activity?.id))
        .filter(Boolean) ?? [];

    return {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      park_id: initialData?.park_id ? String(initialData.park_id) : "",
      activity_ids: activityIds,
      images: initialData?.image
        ? [
            {
              _type: "existing" as const,
              image_id: initialData.image_id as number,
              order: 0,
              small_url: initialData.image.small_url,
              medium_url: initialData.image.medium_url,
              large_url: initialData.image.large_url,
              original_url: initialData.image.original_url,
              alt_text: initialData.image.alt_text,
            },
          ]
        : [],
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const parkId = form.watch("park_id");

  // Fetch activities when park is selected
  useEffect(() => {
    const fetchActivities = async () => {
      if (!parkId) {
        setActivities([]);
        return;
      }

      setLoadingActivities(true);
      try {
        const result = await getActivities({
          park_id: Number(parkId),
          page: 1,
          limit: 100,
        });

        const activityOptions: Option[] = result.activities.map((activity) => ({
          label: activity.name,
          value: String(activity.id),
        }));

        setActivities(activityOptions);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        toast.error("Failed to load activities");
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchActivities();
  }, [parkId]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);

      const imgs = (data as any).images as FileUploaderFormImage[];
      if (imgs && imgs.length > 0) {
        const valid = hasValidImages(imgs);
        if (!valid) return;
      }

      const images = (data as any).images as any[];
      const newImages = images.filter((i) => i._type === "new");

      let imageId: number | null = initialData?.image_id ?? null;

      if (newImages.length > 0) {
        const files = newImages.map((i) => i.file as File);
        const uploadResults = await uploadFilesWithProgress(
          files,
          (m) => setProgresses(m),
          "/api/v1/upload-image"
        );

        const imageRows: TNewImage[] = uploadResults.map((res, index) => ({
          small_url: res.image.small_url,
          medium_url: res.image.medium_url,
          large_url: res.image.large_url,
          original_url: res.image.original_url,
          alt_text: newImages[index]!.alt_text,
        }));

        const created = await createImages(imageRows);
        imageId = created?.[0]?.id ?? null;
      }

      const activityIds = data.activity_ids.map(Number);

      if (!initialData) {
        await createNaturalist(
          {
            name: data.name,
            description: data.description,
            park_id: Number(data.park_id),
            image_id: imageId ?? undefined,
          } as any,
          activityIds
        );
        toast.success("Naturalist created successfully");
        router.replace("/naturalists");
      } else {
        await updateNaturalist(
          initialData.id,
          {
            name: data.name,
            description: data.description,
            park_id: Number(data.park_id),
            image_id: imageId ?? undefined,
          } as any,
          activityIds
        );
        toast.success("Naturalist updated successfully");
        router.replace(`/naturalists/${initialData.id}`);
      }
    } catch (e) {
      toast.error(
        initialData
          ? "Failed to update naturalist"
          : "Failed to create naturalist"
      );
    } finally {
      setIsSaving(false);
      router.refresh();
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
              name="images"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={(field.value || []) as FileUploaderFormImage[]}
                        onValueChange={(value) => field.onChange(value as any)}
                        multiple={false}
                        maxFiles={1}
                        maxSize={MAX_FILE_SIZE}
                        progresses={progresses}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      className="resize-none"
                      {...field}
                    />
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
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset activity selection when park changes
                        form.setValue("activity_ids", []);
                      }}
                      value={field.value?.toString()}
                    >
                      <NationalParkSelect />
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activity_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activities</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={activities}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder={
                        !parkId
                          ? "Select a park first"
                          : loadingActivities
                            ? "Loading activities..."
                            : activities.length === 0
                              ? "No activities available"
                              : "Select activities..."
                      }
                      disabled={!parkId || loadingActivities || isSaving}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="animate-spin" />
              ) : initialData ? (
                "Update Naturalist"
              ) : (
                "Create Naturalist"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NaturalistForm;
