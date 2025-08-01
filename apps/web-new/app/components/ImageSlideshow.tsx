"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  "/hero-images/image-1.avif",
  "/hero-images/image-2.avif",
  "/hero-images/image-3.avif",
  "/hero-images/image-4.avif",
  "/hero-images/image-5.avif",
  "/hero-images/image-6.avif",
];

export default function ImageSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {images.map((image, index) => (
        <div
          key={image}
          className={`transition-opacity duration-2000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            alt=""
            src={image}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
