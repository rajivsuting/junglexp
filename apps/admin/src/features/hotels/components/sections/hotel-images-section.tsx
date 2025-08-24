"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { uploadFilesWithProgress } from "@/lib/upload-files";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHotelImages } from "@repo/actions/hotels.actions";
import { createImages } from "@repo/actions/image.actions";

import type { FormImage } from "@/components/file-uploader";
import type { THotel } from "@repo/db/index";

const ExistingImageSchema = z.object({
  _type: z.literal("existing"),
  image_id: z.number(),
  order: z.number().int().nonnegative(),
  small_url: z.string().url(),
  medium_url: z.string().url(),
  large_url: z.string().url(),
  original_url: z.string().url(),
});

const NewImageSchema = z.object({
  _type: z.literal("new"),
  _tmpId: z.string(),
  previewUrl: z.string(),
  file: z.any(), // File
  mime_type: z.string(),
  size: z.number(),
});

type ExistingFormImage = z.infer<typeof ExistingImageSchema>;
type NewFormImage = z.infer<typeof NewImageSchema>;
type HotelFormImage = ExistingFormImage | NewFormImage;

const imagesFormSchema = z.object({
  images: z.array(z.union([ExistingImageSchema, NewImageSchema])).default([]),
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
        })) as HotelFormImage[],
    },
  });

  const handleSave = async (data: ImagesFormData) => {
    if (!hotelId) {
      toast.error("Hotel ID is required to save images");
      return;
    }

    try {
      setIsSubmitting(true);
      const images = data.images as HotelFormImage[];

      // Filter new images that need to be uploaded
      const newImages = images.filter(
        (img: HotelFormImage) => img._type === "new"
      ) as NewFormImage[];

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
        const imageData = uploadResults.map((result) => ({
          small_url: result.image.small_url,
          medium_url: result.image.medium_url,
          large_url: result.image.large_url,
          original_url: result.image.original_url,
        }));

        const createdImages = await createImages(imageData);

        if (createdImages && createdImages.length > 0) {
          // Create hotel-image associations
          const imageIds = createdImages.map((img) => img.id);
          await createHotelImages(Number(hotelId), imageIds);
          console.log("Created hotel images:", createdImages);
        }

        setIsUploading(false);
      }

      if (onSave) {
        await onSave(data);
      }

      toast.success("Images saved successfully");

      // Reset upload progress
      setUploadProgress({});
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
              <FormLabel>Hotel Images</FormLabel>
              <FormControl>
                <FileUploader
                  value={(field.value || []) as FormImage[]}
                  onValueChange={(value) =>
                    field.onChange(value as HotelFormImage[])
                  }
                  multiple={true}
                  maxFiles={10}
                  progresses={uploadProgress}
                  disabled={isSubmitting || isUploading}
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
        </div>
      </form>
    </Form>
  );
};
