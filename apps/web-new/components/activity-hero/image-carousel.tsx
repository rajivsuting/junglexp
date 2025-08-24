"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface ImageCarouselProps {
	images: string[];
	alt: string;
	autoPlay?: boolean;
	interval?: number;
}

export function ImageCarousel({
	images,
	alt,
	autoPlay = true,
	interval = 2000, // 32 seconds
}: ImageCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	// Auto-play functionality
	useEffect(() => {
		if (!autoPlay || images.length <= 1) return;

		const timer = setInterval(() => {
			setCurrentIndex((prevIndex) => {
				const nextIndex = (prevIndex + 1) % images.length;
				return nextIndex;
			});
		}, interval);

		return () => clearInterval(timer);
	}, [autoPlay, interval, images.length]);

	const handleImageSelect = (index: number) => {
		setCurrentIndex(index);
	};

	return (
		<>
			{/* Image Container */}
			<div className="relative w-full h-full">
				{images.map((image, index) => (
					<img
						key={index}
						src={image}
						alt={`${alt} - View ${index + 1}`}
						className={cn(
							"absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out",
							currentIndex === index
								? "opacity-100 scale-100 z-10"
								: "opacity-0 scale-105 z-0",
						)}
						style={{
							transitionProperty: "opacity, transform",
							transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)",
						}}
					/>
				))}
			</div>

			{/* Vertical Navigation Dots */}
			<div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-3 backdrop-blur-xl bg-white/20 rounded-full p-3 border border-white/30">
				{images.map((_, idx) => (
					<button
						key={idx}
						onClick={() => handleImageSelect(idx)}
						className={cn(
							"w-3 h-3 rounded-full transition-all duration-500 ease-out transform hover:scale-125",
							currentIndex === idx
								? "bg-amber-400 scale-125 shadow-lg ring-2 ring-amber-300/50"
								: "bg-white/60 hover:bg-white/90 scale-100",
						)}
						aria-label={`Go to image ${idx + 1}`}
					/>
				))}
			</div>
		</>
	);
}
