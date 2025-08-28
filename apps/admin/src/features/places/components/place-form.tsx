"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FileUploader, hasValidImages } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { ImagesArraySchema } from "@/lib/image-schema";
import { uploadFilesWithProgress } from "@/lib/upload-files";
import { zodResolver } from "@hookform/resolvers/zod";
import { createImages, deleteImages } from "@repo/actions/image.actions";
import {
  createPlace,
  updatePlace,
  updatePlaceImages,
} from "@repo/actions/places.actions";
import { MAX_FILE_SIZE } from "@repo/db/utils/file-utils";

import type {
  NewFormImage,
  FormImage,
  ExistingFormImage,
} from "@/lib/image-schema";
import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";
import type { TPlaceBase } from "@repo/db/index";
// --------------------
// Form schema
// --------------------
const formSchema = z.object({
  name: z.string().min(1, "Place name is required.").max(255),
  images: ImagesArraySchema,
  description: z.string().min(10, "Description is required."),
  latitude: z
    .string()
    .min(1, "Latitude is required")
    .regex(/^-?\d+(\.\d+)?$/, "Invalid latitude format"),
  longitude: z
    .string()
    .min(1, "Longitude is required")
    .regex(/^-?\d+(\.\d+)?$/, "Invalid longitude format"),
});

type TPlaceFormProps = {
  initialData: (TPlaceBase & { images?: any[] }) | null;
  pageTitle: string;
  placeId?: string;
};

const PlaceForm = (props: TPlaceFormProps) => {
  const { initialData, pageTitle } = props;

  const router = useRouter();

  // --------------------
  // Default values
  // --------------------
  const defaultValues = useMemo(() => {
    return {
      name: initialData?.name || "",
      images: (initialData?.images ?? [])
        .sort((a: any, b: any) => a.order - b.order)
        .map((pi: any) => ({
          _type: "existing" as const,
          image_id: pi.id,
          order: pi.order,

          small_url: pi.image?.small_url || "",
          medium_url: pi.image?.medium_url || "",
          large_url: pi.image?.large_url || "",
          original_url: pi.image?.original_url || "",
          alt_text: pi.image?.alt_text || "",
        })),
      description: initialData?.description || "",
      latitude: initialData?.location.x
        ? initialData.location.x.toString()
        : "",
      longitude: initialData?.location.y
        ? initialData.location.y.toString()
        : "",
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [isImagesUploading, setIsImagesUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Watch images to validate alt text
  const images = form.watch("images");
  const hasValidAltText = useMemo(() => {
    return hasValidImages(images as FileUploaderFormImage[]);
  }, [images]);

  // --------------------
  // Submit: upload new, compute diff, call create/update
  // --------------------
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Mark that user has attempted to submit
    setHasAttemptedSubmit(true);

    // Check if images have valid alt text (only if images are provided)
    if (data.images && data.images.length > 0 && !hasValidAltText) {
      return; // Stop submission if alt text is invalid
    }

    try {
      setIsUpdating(true);

      // Handle images if provided
      if (data.images && data.images.length > 0) {
        const images = data.images as FormImage[];

        // 1) Upload new images first
        const newImages = images.filter(
          (img: FormImage) => img._type === "new"
        ) as NewFormImage[];

        const uploadedImageMap = new Map<string, number>(); // tmpId -> imageId

        if (newImages.length > 0) {
          setIsImagesUploading(true);

          // Upload new images
          const files = newImages.map((img) => img.file);
          const uploadResults = await uploadFilesWithProgress(
            files,
            (progressMap: Record<string, number>) => {
              setProgresses(progressMap);
            },
            "/api/v1/upload-image"
          );

          // Create image records in database
          const imageData = uploadResults.map((result: any, index: number) => ({
            small_url: result.image.small_url,
            medium_url: result.image.medium_url,
            large_url: result.image.large_url,
            original_url: result.image.original_url,
            alt_text: newImages[index]!.alt_text,
          }));

          const createdImages = await createImages(imageData);

          // Map tmpId to actual image ID
          if (Array.isArray(createdImages)) {
            createdImages.forEach((img: any, index: number) => {
              uploadedImageMap.set(newImages[index]!._tmpId, img.id);
            });
          }

          setIsImagesUploading(false);
        }

        // 2) Compute final ordered list with actual image IDs
        const final = images.map((img, idx) => {
          if (img._type === "existing") {
            return {
              image_id: img.image_id,
              order: idx,
              alt_text: img.alt_text,
            };
          } else {
            // New image - get the actual image ID from upload
            const actualImageId = uploadedImageMap.get(img._tmpId);
            if (!actualImageId) {
              throw new Error(
                `Failed to find uploaded image for ${img._tmpId}`
              );
            }
            return {
              image_id: actualImageId,
              order: idx,
              alt_text: img.alt_text,
            };
          }
        });

        // 3) Identify images to delete (those that were removed from the form)
        const initialImageIds = new Set(
          (initialData?.images ?? [])
            .map((pi: any) => pi.id)
            .filter((id): id is number => id !== null)
        );
        const currentImageIds = new Set(final.map((f) => f.image_id));
        const imagesToDelete = [...initialImageIds].filter(
          (id) => !currentImageIds.has(id)
        );

        // 4) Delete orphaned images from the database
        if (imagesToDelete.length > 0) {
          // Note: This would require a deleteImages function similar to hotels
          // For now, we'll just log them
          console.log("Images to delete:", imagesToDelete);
          // 4) Delete orphaned images from the database
          await deleteImages(imagesToDelete);
        }

        if (initialData) {
          // Update flow - update place and handle images
          await updatePlace(initialData.id, {
            name: data.name,
            description: data.description,
            location: { x: Number(data.longitude), y: Number(data.latitude) },
          });

          // Update place images (handles create, update, delete, reorder)
          await updatePlaceImages(initialData.id, final);

          toast.success("Place updated successfully!");
        } else {
          // Create flow
          const newPlace = await createPlace({
            name: data.name,
            description: data.description,
            location: { x: Number(data.longitude), y: Number(data.latitude) },
          });

          // Update place images for the newly created place
          await updatePlaceImages(newPlace.id, final);

          toast.success("Place created successfully!");
        }
      } else {
        // No images provided - just create/update the place
        if (initialData) {
          await updatePlace(initialData.id, {
            name: data.name,
            description: data.description,
            location: { x: Number(data.longitude), y: Number(data.latitude) },
          });
          toast.success("Place updated successfully!");
        } else {
          await createPlace({
            name: data.name,
            description: data.description,
            location: { x: Number(data.longitude), y: Number(data.latitude) },
          });
          toast.success("Place created successfully!");
        }
      }
    } catch (error) {
      console.error("Error saving place:", error);
      toast.error("Failed to save place. Please try again.");
    } finally {
      setIsUpdating(false);
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
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value as unknown as any}
                        onValueChange={field.onChange}
                        maxFiles={8}
                        maxSize={MAX_FILE_SIZE}
                        multiple
                        progresses={progresses}
                        disabled={isImagesUploading}
                        showValidation={hasAttemptedSubmit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Place Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter place name" {...field} />
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
                    <Textarea
                      placeholder="Enter place description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location Coordinates</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="noscroll"
                          step="any"
                          placeholder="0.000000"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Latitude coordinate (e.g., 12.9716)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          className="noscroll"
                          type="number"
                          step="any"
                          placeholder="0.000000"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Longitude coordinate (e.g., 77.5946)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isUpdating || isImagesUploading}>
              {isUpdating && <Loader2 className="animate-spin" />}
              {isUpdating
                ? initialData
                  ? "Updating Place..."
                  : "Creating Place..."
                : "Submit"}
            </Button>

            {!hasValidAltText && images.length > 0 && hasAttemptedSubmit && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ Please add alt text to all images before submitting
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PlaceForm;
