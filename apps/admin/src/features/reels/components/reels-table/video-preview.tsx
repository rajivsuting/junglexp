"use client";

import { Play } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';

type Props = {
  videoUrl: string;
  title?: string;
};

export default function VideoPreview({ videoUrl, title }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [open, setOpen] = useState(false);

  const onOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    const vid = videoRef.current;
    if (!next && vid) {
      try {
        vid.pause();
        vid.currentTime = 0;
      } catch {}
    }
  }, []);

  const onPlayPause = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) vid.play();
    else vid.pause();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Preview video">
          <Play />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title || "Video Preview"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full rounded-md bg-black"
            controls
            playsInline
          />
          <div className="flex gap-2">
            <Button onClick={onPlayPause} variant="secondary">
              Play/Pause
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
