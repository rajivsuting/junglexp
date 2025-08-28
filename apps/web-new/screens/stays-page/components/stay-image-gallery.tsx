"use client";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { THotel } from "@repo/db/index";
type StayImageGalleryProps = Pick<THotel, "images"> & {};

export const StayImageGallery = (props: StayImageGalleryProps) => {
  const { images } = props;
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  return (
    <>
      <section className="relative mb-8">
        <div className="grid grid-cols-4 gap-2 aspect-[12/5] overflow-hidden">
          <div className="col-span-2 row-span-2 relative">
            <Image
              src={images[0]?.image?.original_url!}
              alt={images[0]?.image?.alt_text!}
              fill
              className="object-cover hover:brightness-90 transition-all cursor-pointer"
              onClick={() => setShowAllPhotos(true)}
            />
          </div>
          {[1, 2, 3, 4].map((index) => {
            const image = images[index];
            return (
              <div key={index} className="relative">
                {!image ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={image?.image?.original_url}
                    alt={image?.image?.alt_text}
                    fill
                    className="object-cover hover:brightness-90 transition-all cursor-pointer"
                    onClick={() => setShowAllPhotos(true)}
                  />
                )}
              </div>
            );
          })}
          <button
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-4 right-4 bg-white px-4 py-2 font-medium text-sm hover:bg-gray-100 transition-colors border border-gray-300"
          >
            Show all photos
          </button>
        </div>
      </section>
      {/* Photo Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="mb-4 text-primary hover:text-accent transition-colors"
            >
              ← Back to listing
            </button>
            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-[16/9]">
                  <Image
                    src={image?.image?.original_url}
                    alt={image?.image?.alt_text}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
