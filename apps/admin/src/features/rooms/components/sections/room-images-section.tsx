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
} from "@/components/ui/form";
import { ImagesArraySchema } from "@/lib/image-schema";
import { uploadFilesWithProgress } from "@/lib/upload-files";
import { zodResolver } from "@hookform/resolvers/zod";
import { createImages, deleteImages } from "@repo/actions/image.actions";
import { updateRoomImages } from "@repo/actions/rooms.actions";

import type {
  NewFormImage,
  FormImage,
  ExistingFormImage,
} from "@/lib/image-schema";
import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";
import type { TRoom } from "@repo/db/schema/types";

const imagesFormSchema = z.object({
  images: ImagesArraySchema.default([]),
});

type ImagesFormData = z.infer<typeof imagesFormSchema>;

interface RoomImagesSectionProps {
  initialData?: TRoom | null;
  roomId?: string;
  onSave?: (data: ImagesFormData) => Promise<void>;
}

export default function RoomImagesSection({
  initialData,
  roomId,
  onSave,
}: RoomImagesSectionProps) {
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
          alt_text: pi.image.alt_text,
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

    if (!roomId) {
      toast.error("Room ID is required to save images");
      return;
    }

    try {
      setIsSubmitting(true);
      const images = data.images as FormImage[];

      // 1) Upload new images first
      const newImages = images.filter(
        (img: FormImage) => img._type === "new"
      ) as NewFormImage[];

      if (newImages.length > 0) {
        setIsUploading(true);
        const uploadResults = await uploadFilesWithProgress(
          newImages.map((img) => img.file),
          (progress) => {
            setUploadProgress(progress);
          }
        );

        // 2) Create image records and get actual IDs
        const createdImages = await createImages(
          uploadResults.map((result) => ({
            small_url: result.image.small_url,
            medium_url: result.image.medium_url,
            large_url: result.image.large_url,
            original_url: result.image.original_url,
            alt_text: result.image.alt_text,
          }))
        );

        // 3) Replace new images with existing ones in the form data
        const final = images.map((img: FormImage, index: number) => {
          if (img._type === "new") {
            const newImage = newImages.find((ni) => ni._tmpId === img._tmpId);
            const createdImage = createdImages.find(
              (ci) => ci.small_url === newImage?.file.small_url
            );
            const actualImageId = createdImage?.id;

            if (!actualImageId) {
              throw new Error(
                `Failed to find uploaded image for ${img._tmpId}`
              );
            }
            return {
              image_id: actualImageId,
              order: index,
              alt_text: img.alt_text,
            };
          }
          return {
            image_id: img.image_id,
            order: img.order,
            alt_text: img.alt_text,
          };
        });

        // 4) Identify images to delete (those that were removed from the form)
        const initialImageIds = new Set(
          (initialData?.images ?? [])
            .map((pi) => pi.image_id)
            .filter((id): id is number => id !== null)
        );
        const currentImageIds = new Set(final.map((f) => f.image_id));
        const imagesToDelete = [...initialImageIds].filter(
          (id) => !currentImageIds.has(id)
        );

        // 5) Delete orphaned images from the database
        if (imagesToDelete.length > 0) {
          await deleteImages(imagesToDelete);
        }

        // 6) Update room images (handles create, update, delete, reorder)
        await updateRoomImages(Number(roomId), final);

        if (onSave) {
          await onSave(data);
        }

        toast.success("Images saved successfully");

        // Reset upload progress
        setUploadProgress({});
      }
    } catch (error) {
      console.error("Error saving images:", error);
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
              <FormLabel>Room Images</FormLabel>
              <FormControl>
                <FileUploader
                  value={(field.value || []) as FileUploaderFormImage[]}
                  onValueChange={(value) =>
                    field.onChange(value as FormImage[])
                  }
                  multiple={true}
                  maxFiles={10}
                  progresses={uploadProgress}
                  disabled={isSubmitting || isUploading}
                  showValidation={hasAttemptedSubmit}
                />
              </FormControl>
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
}
