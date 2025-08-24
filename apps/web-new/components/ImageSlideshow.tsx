"use client";

import type { TImage } from "@repo/db/schema/image";
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ImageSlideshow({ images }: { images: TImage[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`transition-opacity abslute inset-0 duration-2000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* <img
            src={image.original_url}
            alt=""
            className="object-cover block w-full h-full object-center"
            srcSet={
              `${image.small_url} 480w, ` +
              `${image.medium_url} 768w, ` +
              `${image.large_url} 1024w, ` +
              `${image.original_url} 1280w`
            }
            sizes="
              (min-width: 1280px) 1200px,
              (min-width: 1024px) 900px,
              (min-width: 768px) 700px,
              100vw
            "
          /> */}
          <Image
            alt=""
            src={image.original_url}
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
