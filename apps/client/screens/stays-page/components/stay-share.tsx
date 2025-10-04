"use client";
import { Share } from 'lucide-react';
import React, { useCallback } from 'react';

const StayShare = ({ name, zone }: { name: string; zone: any }) => {
  const handleShare = useCallback(async () => {
    const shareData = {
      title: name,
      text: `${name} • ${zone.park.city.name}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch (err) {
      // If user cancels or share fails, fall back to clipboard
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      // Optional: You can integrate a toast system later
    } catch (err) {
      // Swallow silently; no toast system wired here
    }
  }, [name, zone]);

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 hover:text-accent transition-colors"
      aria-label="Share this stay"
    >
      <Share className="w-5 h-5" />
      <span className="underline">Share</span>
    </button>
  );
};

export default StayShare;
