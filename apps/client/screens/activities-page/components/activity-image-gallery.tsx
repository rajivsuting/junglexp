"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import type { TActivityImage } from "@repo/db/index";

interface ActivityImageGalleryProps {
  images: TActivityImage[];
}

export function ActivityImageGallery({ images }: ActivityImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  // Filter out images without URLs and get URLs
  const imageUrls =
    images
      ?.filter((img) => img.image?.original_url)
      .map((img) => ({
        url: img.image!.original_url!,
        thumbnail: img.image!.small_url!,
        alt: img.image!.alt_text || "Activity image",
      })) || [];

  if (imageUrls.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-8">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImageIndex === null) return;

    if (direction === "prev") {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? imageUrls.length - 1 : selectedImageIndex - 1
      );
    } else {
      setSelectedImageIndex(
        selectedImageIndex === imageUrls.length - 1 ? 0 : selectedImageIndex + 1
      );
    }
  };

  return (
    <>
      <div className="mb-8">
        {imageUrls.length === 1 ? (
          // Single image layout
          <div className="relative w-full h-96 rounded-lg overflow-hidden cursor-pointer">
            <Image
              src={imageUrls[0]!.url}
              alt={imageUrls[0]!.alt}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              onClick={() => openLightbox(0)}
            />
          </div>
        ) : (
          // Multiple images layout
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96">
            {/* Main large image */}
            <div className="col-span-4 md:col-span-2 row-span-2 relative rounded-lg overflow-hidden cursor-pointer">
              <Image
                src={imageUrls[0]!.url}
                alt={imageUrls[0]!.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                onClick={() => openLightbox(0)}
              />
            </div>

            {/* Smaller images */}
            {imageUrls.slice(1, 5).map((image, index) => (
              <div
                key={index + 1}
                className="relative hidden md:block rounded-lg overflow-hidden cursor-pointer"
              >
                <Image
                  src={image.thumbnail}
                  alt={image.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  onClick={() => openLightbox(index + 1)}
                />
                {/* Show count overlay on last image if there are more */}
                {index === 3 && imageUrls.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      +{imageUrls.length - 5}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Show all photos button */}
        {imageUrls.length > 1 && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => openLightbox(0)}
          >
            View all {imageUrls.length} photos
          </Button>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl w-full h-full max-h-[90vh] p-0">
          {selectedImageIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation buttons */}
              {imageUrls.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 z-10 text-white hover:bg-white/20"
                    onClick={() => navigateImage("prev")}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-16 z-10 text-white hover:bg-white/20"
                    onClick={() => navigateImage("next")}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Image */}
              <div className="relative w-full h-full">
                <Image
                  src={imageUrls[selectedImageIndex]!.url}
                  alt={imageUrls[selectedImageIndex]!.alt}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Image counter */}
              {imageUrls.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {imageUrls.length}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
