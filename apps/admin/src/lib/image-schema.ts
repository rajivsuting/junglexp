// --------------------
// Image union schemas

import z from 'zod';

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@repo/db/utils/file-utils';

// --------------------
export const ExistingImageSchema = z.object({
  _type: z.literal("existing"),
  image_id: z.number(),
  order: z.number().int().nonnegative(),
  small_url: z.string().url(),
  medium_url: z.string().url(),
  large_url: z.string().url(),
  original_url: z.string().url(),
  alt_text: z.string().min(1, "Alt text is required"),
});

export const NewImageSchema = z.object({
  _type: z.literal("new"),
  _tmpId: z.string(),
  previewUrl: z.string(),
  file: z.any(), // File
  mime_type: z.string(),
  size: z.number(),
  alt_text: z.string().min(1, "Alt text is required"),
});

export type ExistingFormImage = z.infer<typeof ExistingImageSchema>;
export type NewFormImage = z.infer<typeof NewImageSchema>;
export type FormImage = ExistingFormImage | NewFormImage;

// --------------------
// Images array schema with validations for new items only
// --------------------
export const ImagesArraySchema = z
  .array(z.union([ExistingImageSchema, NewImageSchema]))

  .refine(
    (items) =>
      items
        .filter((i): i is NewFormImage => i._type === "new")
        .every((i) => i.size <= MAX_FILE_SIZE),
    "Max file size is 5MB."
  )
  .refine(
    (items) =>
      items
        .filter((i): i is NewFormImage => i._type === "new")
        .every((i) => ACCEPTED_IMAGE_TYPES.includes(i.mime_type)),
    ".jpg, .jpeg, .png and .webp files are accepted."
  )
  .refine(
    (items) => items.every((i) => i.alt_text.trim().length > 0),
    "All images must have alt text."
  );
