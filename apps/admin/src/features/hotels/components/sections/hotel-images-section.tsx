"use client";

import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FileUploader, hasValidImages } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImagesArraySchema } from "@/lib/image-schema";
import { uploadFilesWithProgress } from "@/lib/upload-files";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateHotelImages } from "@repo/actions/hotels.actions";
import { createImages, deleteImages } from "@repo/actions/image.actions";

import type {
  NewFormImage,
  FormImage,
  ExistingFormImage,
} from "@/lib/image-schema";
import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";
import type { THotel } from "@repo/db/index";

const imagesFormSchema = z.object({
  images: ImagesArraySchema(5, 20).default([]),
});

type ImagesFormData = z.infer<typeof imagesFormSchema>;

interface HotelImagesSectionProps {
  initialData?: THotel | null;
  hotelId?: string;
  onSave?: (data: ImagesFormData) => Promise<void>;
}

export const HotelImagesSection = ({
  initialData,
  hotelId,
  onSave,
}: HotelImagesSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );

  const form = useForm<ImagesFormData>({
    resolver: zodResolver(imagesFormSchema),
    defaultValues: {
      images: (initialData?.images ?? [])
        .sort((a, b) => a.order - b.order)
        .map((pi) => ({
          _type: "existing" as const,
          image_id: pi.image_id,
          order: pi.order,
          small_url: pi.image.small_url,
          medium_url: pi.image.medium_url,
          large_url: pi.image.large_url,
          original_url: pi.image.original_url,
          alt_text: pi.image.alt_text, // TODO: Get from database when alt_text is added to schema
        })) as FormImage[],
    },
  });

  // Watch images to validate alt text
  const images = form.watch("images");
  const hasValidAltText = useMemo(() => {
    return hasValidImages(images as FileUploaderFormImage[]);
  }, [images]);

  const handleSave = async (data: ImagesFormData) => {
    // Mark that user has attempted to submit
    setHasAttemptedSubmit(true);

    // Check if images have valid alt text
    if (!hasValidAltText) {
      return; // Stop submission if alt text is invalid
    }

    if (!hotelId) {
      toast.error("Hotel ID is required to save images");
      return;
    }

    try {
      setIsSubmitting(true);
      const images = data.images as FormImage[];

      // 1) Upload new images first
      const newImages = images.filter(
        (img: FormImage) => img._type === "new"
      ) as NewFormImage[];

      const uploadedImageMap = new Map<string, number>(); // tmpId -> imageId

      if (newImages.length > 0) {
        setIsUploading(true);

        // Upload new images
        const files = newImages.map((img) => img.file);
        const uploadResults = await uploadFilesWithProgress(
          files,
          (progressMap) => {
            setUploadProgress(progressMap);
          },
          "/api/v1/upload-image"
        );

        // Create image records in database
        const imageData = uploadResults.map((result, index) => ({
          small_url: result.image.small_url,
          medium_url: result.image.medium_url,
          large_url: result.image.large_url,
          original_url: result.image.original_url,
          alt_text: newImages[index]!.alt_text,
        }));

        const createdImages = await createImages(imageData);

        // Map tmpId to actual image ID
        createdImages.forEach((img, index) => {
          uploadedImageMap.set(newImages[index]!._tmpId, img.id);
        });

        setIsUploading(false);
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
            throw new Error(`Failed to find uploaded image for ${img._tmpId}`);
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
          .map((pi) => pi.image_id)
          .filter((id): id is number => id !== null)
      );
      const currentImageIds = new Set(final.map((f) => f.image_id));
      const imagesToDelete = [...initialImageIds].filter(
        (id) => !currentImageIds.has(id)
      );

      // 4) Delete orphaned images from the database
      if (imagesToDelete.length > 0) {
        await deleteImages(imagesToDelete);
      }

      // 5) Update hotel images (handles create, update, delete, reorder)
      await updateHotelImages(Number(hotelId), final);

      if (onSave) {
        await onSave(data);
      }

      toast.success("Images saved successfully");

      // Reset upload progress
      setUploadProgress({});
    } catch (error) {
      toast.error("Failed to save images. Please try again.");
      setIsUploading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Images</FormLabel>
              <FormControl>
                <FileUploader
                  value={(field.value || []) as FileUploaderFormImage[]}
                  onValueChange={(value) =>
                    field.onChange(value as FormImage[])
                  }
                  multiple={true}
                  maxFiles={20}
                  progresses={uploadProgress}
                  disabled={isSubmitting || isUploading}
                  showValidation={hasAttemptedSubmit}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full md:w-auto"
          >
            {(isSubmitting || isUploading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isUploading
              ? "Uploading..."
              : isSubmitting
                ? "Saving..."
                : "Save Images"}
          </Button>

          {!hasValidAltText && images.length > 0 && hasAttemptedSubmit && (
            <p className="text-sm text-red-600 mt-2">
              ⚠️ Please add alt text to all images before submitting
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};
