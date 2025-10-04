"use client";

import type { TReelBase } from "@repo/db/schema/reels";
import { Pause, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

interface ReelItemProps {
  reel: TReelBase;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

function ReelItem({ reel, isActive, isMuted, onToggleMute }: ReelItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={reel.videoUrl}
        loop
        muted
        playsInline
        onClick={togglePlay}
        onTouchStart={() => setShowControls(true)}
        onTouchEnd={() => setTimeout(() => setShowControls(false), 2000)}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      />

      {/* Play/Pause Overlay */}
      {showControls && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 transition-opacity duration-300"
          onClick={togglePlay}
        >
          {!isPlaying && (
            <div className="bg-black bg-opacity-50 rounded-full p-4">
              <Play className="w-12 h-12 text-white fill-white" />
            </div>
          )}
        </div>
      )}

      {/* Bottom Package Card Overlay */}
      <div className="absolute bottom-0 left-0 right-0  flex flex-col">
        {/* Video Controls */}
        <div className="pr-6 self-end flex flex-col space-y-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-opacity-70 transition-all lg:bg-[#2a2b20] md:backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Mute/Unmute Button */}
          <button
            onClick={onToggleMute}
            className="w-12 h-12 rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-opacity-70 transition-all backdrop-blur-sm"
          >
            {isMuted ? (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  clipRule="evenodd"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            )}
          </button>
        </div>
        <Link target="_blank" href={reel.redirectUrl} className="p-4">
          <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-start space-x-3">
              {/* Package Image */}
              <Image
                src="/android-chrome-512x512.png"
                // fill
                width={64}
                height={64}
                alt={reel.title}
                className="object-cover"
              />

              {/* Package Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm md:text-lg leading-tight mb-1">
                  {reel.title}
                </h3>
                <p
                  className="text-white/80 text-xs md:text-sm leading-relaxed mb-2 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {reel.description}
                </p>

                {/* Package Count */}
                {/* <div className="flex items-center justify-between">
                  <span className="text-green-400 font-medium text-xs md:text-sm">
                    4+ Packages
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function ReelsPage({ reels }: { reels: TReelBase[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [globalIsMuted, setGlobalIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const windowHeight = window.innerHeight;
        const newIndex = Math.round(scrollTop / windowHeight);
        setCurrentIndex(newIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleToggleMute = () => {
    setGlobalIsMuted(!globalIsMuted);
  };

  return (
    <div className="bg-black h-[100dvh] max-w-md mx-auto relative">
      {/* Reels Container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        {reels.map((reel, index) => (
          <div key={reel.id} className="snap-start h-[100dvh]">
            <ReelItem
              reel={reel}
              isActive={index === currentIndex}
              isMuted={globalIsMuted}
              onToggleMute={handleToggleMute}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
