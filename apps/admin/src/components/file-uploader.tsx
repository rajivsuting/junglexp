"use client";
import React, { useCallback, useMemo } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@repo/db/utils/file-utils';

import type { DragEndEvent } from "@dnd-kit/core";

export const ExistingImageSchema = z.object({
  _type: z.literal("existing"),
  image_id: z.number(),
  order: z.number().int().nonnegative(),
  small_url: z.string().url(),
  medium_url: z.string().url(),
  large_url: z.string().url(),
  original_url: z.string().url(),
});

export const NewImageSchema = z.object({
  _type: z.literal("new"),
  _tmpId: z.string(),
  previewUrl: z.string(),
  file: z.any(), // File
  mime_type: z.string(),
  size: z.number(),
});

// types.ts
export type TImage = {
  id: number;
  created_at: Date | null;
  updated_at: Date | null;
  small_url: string;
  medium_url: string;
  large_url: string;
  original_url: string;
};

export type TParkImage = {
  park_id: number;
  image_id: number;
  order: number;
  image: TImage;
};

export type ExistingFormImage = {
  _type: "existing";
  image_id: number;
  order: number;
  small_url: string;
  medium_url: string;
  large_url: string;
  original_url: string;
};

export type NewFormImage = {
  _type: "new";
  _tmpId: string;
  file: File;
  previewUrl: string;
  size: number;
  mime_type: string;
};

export type FormImage = ExistingFormImage | NewFormImage;

export const isExisting = (i: FormImage): i is ExistingFormImage =>
  i._type === "existing";
export const isNew = (i: FormImage): i is NewFormImage => i._type === "new";
export const keyOf = (img: FormImage) =>
  img._type === "existing" ? `ex-${img.image_id}` : `new-${img._tmpId}`;

type Props = {
  value: FormImage[];
  onValueChange: (next: FormImage[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  progresses?: Record<string, number>;
  disabled?: boolean;
};

export const FileUploader: React.FC<Props> = ({
  value,
  onValueChange,
  multiple = true,
  maxFiles = 8,
  maxSize = MAX_FILE_SIZE,
  progresses = {},
  disabled,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const onFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files);
      const accept = new Set(ACCEPTED_IMAGE_TYPES);
      const filtered = incoming.filter(
        (f) => f.size <= maxSize && accept.has(f.type)
      );
      if (filtered.length === 0) return;

      const remainingSlots = Math.max(0, maxFiles - value.length);
      const take = filtered.slice(0, remainingSlots);

      const mapped: NewFormImage[] = take.map((file) => ({
        _type: "new",
        _tmpId: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        size: file.size,
        mime_type: file.type,
      }));

      onValueChange([...value, ...mapped]);
    },
    [value, onValueChange, maxFiles, maxSize]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      onFiles(e.target.files);
      e.target.value = ""; // reset
    },
    [onFiles]
  );

  const removeAt = useCallback(
    (idx: number) => {
      const target = value[idx]!;
      // Revoke object URL for new images
      if (isNew(target)) URL.revokeObjectURL(target.previewUrl);
      const next = [...value.slice(0, idx), ...value.slice(idx + 1)];
      onValueChange(next);
    },
    [value, onValueChange]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = value.findIndex((i) => keyOf(i) === active.id);
      const newIndex = value.findIndex((i) => keyOf(i) === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const next = arrayMove(value, oldIndex, newIndex);
      onValueChange(next);
    },
    [value, onValueChange]
  );

  const items = useMemo(
    () => value.map((i) => ({ id: keyOf(i), img: i })),
    [value]
  );

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-md p-4 text-center ${disabled ? "opacity-50" : "cursor-pointer"}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (disabled) return;
          const files = e.dataTransfer.files;
          if (files && files.length > 0) onFiles(files);
        }}
        onClick={() => {
          if (disabled) return;
          document.getElementById("file-input-hidden")?.click();
        }}
      >
        <p className="text-sm">Click or drag images here</p>
        <input
          id="file-input-hidden"
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          multiple={multiple}
          className="hidden"
          onChange={onInputChange}
          disabled={disabled}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map(({ id, img }, idx) => (
              <SortableItem
                key={id}
                id={id}
                img={img}
                progress={progresses[id] ?? 0}
                onRemove={() => removeAt(idx)}
                disabled={disabled}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

function SortableItem({
  id,
  img,
  progress,
  onRemove,
  disabled,
}: {
  id: string;
  img: FormImage;
  progress: number;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const src =
    img._type === "existing"
      ? (img.small_url ?? img.original_url)
      : img.previewUrl;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative rounded-md overflow-hidden border bg-muted"
      {...attributes}
      {...listeners}
    >
      <div className="aspect-video relative">
        {/* Use next/image if domain is configured, else <img> */}
        <img src={src} alt="" className="h-full w-full object-cover" />
        {progress > 0 && progress < 100 ? (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1">
            Uploading… {Math.round(progress)}%
          </div>
        ) : null}
      </div>
      <div className="absolute top-1 right-1">
        <Button
          variant="destructive"
          size="sm"
          type="button"
          onClick={onRemove}
          disabled={disabled}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
