"use client";

import type { TImage } from "@repo/db/schema/image";
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ImageSlideshow({
  images,
  mobileImages,
}: {
  images: TImage[];
  mobileImages: TImage[];
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Use the length of whichever image set has images
    const totalImages = images.length > 0 ? images.length : mobileImages.length;

    if (totalImages === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, [images.length, mobileImages.length]);

  return (
    <div className="absolute inset-0">
      {/* Desktop/Tablet Images - Hidden on mobile */}
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`hidden md:block transition-opacity absolute inset-0 duration-2000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            alt={image.alt_text}
            src={image.original_url}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Mobile Images - Visible on mobile only */}
      {mobileImages.map((image, index) => (
        <div
          key={`mobile-${image.id}`}
          className={`block md:hidden transition-opacity absolute inset-0 duration-2000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.original_url}
            alt={image.alt_text}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
