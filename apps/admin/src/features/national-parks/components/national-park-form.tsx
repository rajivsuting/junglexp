"use client";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uploadFilesWithProgress } from "@/lib/upload-files";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPark } from "@repo/actions/parks.actions";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@repo/db/utils/file-utils";

import CitiesSelect from "./cities-select";
import StatesSelect from "./states-select";

import type { TNationalPark } from "@repo/db/schema/types";

// --------------------
// Image union schemas
// --------------------
const ExistingImageSchema = z.object({
  _type: z.literal("existing"),
  image_id: z.number(),
  order: z.number().int().nonnegative(),
  small_url: z.string().url(),
  medium_url: z.string().url(),
  large_url: z.string().url(),
  original_url: z.string().url(),
});

const NewImageSchema = z.object({
  _type: z.literal("new"),
  _tmpId: z.string(),
  previewUrl: z.string(),
  file: z.any(), // File
  mime_type: z.string(),
  size: z.number(),
});

type ExistingFormImage = z.infer<typeof ExistingImageSchema>;
type NewFormImage = z.infer<typeof NewImageSchema>;
type FormImage = ExistingFormImage | NewFormImage;

// --------------------
// Images array schema with validations for new items only
// --------------------
const ImagesArraySchema = z
  .array(z.union([ExistingImageSchema, NewImageSchema]))
  .min(1, "At least one image is required.")
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
  );

// --------------------
// Form schema
// --------------------
const formSchema = z.object({
  name: z.string().min(1, "National Park name is required.").max(255),
  images: ImagesArraySchema,
  description: z.string().min(10, "Description is required."),
  state_id: z.string().refine((value) => value, "State is required."),
  city_id: z.string().refine((value) => value, "City is required."),
});

type TNationalParkFormProps = {
  initialData: TNationalPark | null;
  pageTitle: string;
};

const NationalParkForm = (props: TNationalParkFormProps) => {
  const { initialData, pageTitle } = props;

  // --------------------
  // Default values
  // --------------------
  const defaultValues = useMemo(() => {
    return {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      images: (initialData?.images ?? [])
        .sort((a, b) => a.order - b.order)
        .map((pi) => ({
          _type: "existing" as const,
          image_id: pi.image_id,
          order: pi.order,
          small_url: pi.image.small_url,
          medium_url: pi.image.medium_url,
          large_url: pi.image.large_url,
          original_url: pi.image.original_url,
        })),
      description: initialData?.description || "",
      city_id: initialData?.city_id?.toString() ?? "",
      state_id: initialData?.city?.state_id?.toString() ?? "",
    };
  }, [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [isImagesUploading, setIsImagesUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // --------------------
  // Upload only new files; expect server to return created TImage per file
  // results[i] should be like: { image: { id, small_url, medium_url, large_url, original_url } }
  // --------------------
  const uploadNewImages = async (images: FormImage[]) => {
    const newOnes = images.filter((i) => i._type === "new") as NewFormImage[];

    if (newOnes.length === 0) return [];

    setIsImagesUploading(true);
    try {
      const files = newOnes.map((n) => n.file);
      const results = await uploadFilesWithProgress(
        files,
        (map) => {
          // If your upload utility identifies progress by file index, map to each new image _tmpId here
          // Example: for (const [k,v] of Object.entries(map)) progresses[`new-${newOnes[Number(k)]._tmpId}`] = v
          setProgresses((prev) => ({ ...prev, ...map }));
        },
        "/api/v1/upload-image"
      );
      console.log("results", results);

      return results.map((res: any, idx: number) => ({
        _tmpId: newOnes[idx]!._tmpId,
        image: res.image as {
          id: number;
          small_url: string;
          medium_url: string;
          large_url: string;
          original_url: string;
        },
      }));
    } finally {
      setIsImagesUploading(false);
    }
  };

  // --------------------
  // Submit: upload new, compute diff, call create/update
  // --------------------
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsUpdating(true);

      // 1) Upload only new files to get image ids
      const uploaded = await uploadNewImages(data.images);
      console.log("uploaded", uploaded);

      const byTmp = new Map(uploaded.map((u) => [u._tmpId, u.image]));

      // 2) Final ordered list (array order is the source of truth)
      const final = data.images.map((img, idx) => ({ img, order: idx }));

      console.log("final", final, byTmp);

      // 3) Compute removed image_ids (present initially but not in current existing set)
      const initialIds = new Set(
        (initialData?.images ?? []).map((pi) => pi.image_id)
      );
      const currentExistingIds = new Set(
        final
          .filter((f) => f.img._type === "existing")
          .map((f) => (f.img as ExistingFormImage).image_id)
      );
      const removed: number[] = [...initialIds].filter(
        (id) => !currentExistingIds.has(id)
      );

      // 4) Existing with updated order
      const existing = final
        .filter((f) => f.img._type === "existing")
        .map((f) => ({
          image_id: (f.img as ExistingFormImage).image_id,
          order: f.order,
        }));

      // 5) Added mapped to uploaded image ids with order
      const added = final
        .filter((f) => f.img._type === "new")
        .map((f) => {
          const n = f.img as NewFormImage;
          const created = byTmp.get(n._tmpId);
          if (!created) throw new Error("Missing uploaded image mapping");
          return { image: created, order: f.order };
        });

      const parkPayload = {
        name: data.name,
        description: data.description,
        slug: data.name.toLowerCase().replace(/ /g, "-"),
        city_id: Number(data.city_id),
      };

      // Create flow: if your create action expects a different shape, adjust accordingly
      // Option 1: send only added on create; server will attach them in order
      const park = await createPark(
        parkPayload,
        {
          existing: initialData ? existing : [],
          added,
          removed: initialData ? removed : [],
        },
        initialData?.id
      );
      console.log("park", park);
      toast.success("National Park created successfully");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value as unknown as any}
                        onValueChange={field.onChange}
                        maxFiles={8}
                        maxSize={MAX_FILE_SIZE}
                        multiple
                        progresses={progresses}
                        disabled={isImagesUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Park Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Park name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter Park description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="state_id"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
                      <StatesSelect />
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
                      <CitiesSelect watch={form.watch} stateKey="state_id" />
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isUpdating || isImagesUploading}>
              {isUpdating && <Loader2 className="animate-spin" />}
              {isUpdating
                ? initialData
                  ? "Updating Park..."
                  : "Creating Park..."
                : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NationalParkForm;
