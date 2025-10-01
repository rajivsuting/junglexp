"use client";
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { FileUploader, hasValidImages } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createSlug } from '@/lib/format';
import { ImagesArraySchema } from '@/lib/image-schema';
import { shouldUpdate } from '@/lib/should-update';
import { uploadFilesWithProgress } from '@/lib/upload-files';
import { zodResolver } from '@hookform/resolvers/zod';
import { createImages, deleteImages } from '@repo/actions/image.actions';
import {
    createSouvenirBase, updateSouvenir, updateSouvenirImages
} from '@repo/actions/souvenirs.actions';
import { MAX_FILE_SIZE } from '@repo/db/utils/file-utils';

import NationalParkSelect from './components/park-select';

import type { TSouvenir } from "@repo/db/index";
import type { TNewImage } from "@repo/db/schema/image";
import type { FormImage as FileUploaderFormImage } from "@/components/file-uploader";

type TSouvenirFormProps = {
  initialData: TSouvenir | null;
  pageTitle: string;
};

const formSchema = z.object({
  name: z.string().min(1, "Souvenir name is required.").max(255),
  description: z.string().min(1, "Souvenir description is required."),
  price: z.number().min(1, "Souvenir price is required."),
  images: ImagesArraySchema(1, 8).default([]),
  park_id: z.string().min(1, "National Park is required."),
  // is_available: z.boolean().default(false),
  quantity: z.string().min(0, "Souvenir quantity is required."),
});

const SouvenirForm = (props: TSouvenirFormProps) => {
  const { initialData, pageTitle } = props;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    images: (initialData?.images || [])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((pi) => ({
        _type: "existing" as const,
        image_id: pi.image_id,
        order: pi.order ?? 0,
        small_url: pi.image.small_url,
        medium_url: pi.image.medium_url,
        large_url: pi.image.large_url,
        original_url: pi.image.original_url,
        alt_text: pi.image.alt_text,
      })),
    quantity: initialData?.quantity?.toString() || "0",
    park_id: initialData?.park_id ? initialData.park_id.toString() : "",
    // is_available: initialData?.is_available || false,
  };

  const buttonText = initialData ? "Update Souvenir" : "Create Souvenir";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!initialData) {
        setHasAttemptedSubmit(true);
        // Validate alt text if images present
        const imgs = (data as any).images as FileUploaderFormImage[];
        if (imgs && imgs.length > 0) {
          const valid = hasValidImages(imgs);
          if (!valid) return;
        }
        // create
        setIsLoading(true);
        const { images: imagesField, ...rest } = data as any;

        // Upload new images if any
        const images = imagesField as any[];
        const newImages = images.filter((i: any) => i._type === "new");
        const uploadedIdByTmp = new Map<string, number>();

        if (newImages.length > 0) {
          setIsUploading(true);
          const files = newImages.map((i: any) => i.file as File);
          const uploadResults = await uploadFilesWithProgress(
            files,
            (m) => setProgresses(m),
            "/api/v1/upload-image"
          );

          const imageRows: TNewImage[] = uploadResults.map((res, index) => ({
            small_url: res.image.small_url,
            medium_url: res.image.medium_url,
            large_url: res.image.large_url,
            original_url: res.image.original_url,
            alt_text: newImages[index]!.alt_text,
          }));

          const created = await createImages(imageRows);
          created.forEach((row: any, idx: number) => {
            uploadedIdByTmp.set(newImages[idx]!._tmpId, row.id);
          });
          setIsUploading(false);
        }

        // Create base souvenir
        const createdSouvenir = await createSouvenirBase({
          ...rest,
          slug: createSlug(rest.name),
          park_id: Number(rest.park_id),
        });

        // Build final ordered images payload and persist
        const finalImages = (images as any[]).map((img, idx) => {
          if (img._type === "existing") {
            return {
              image_id: img.image_id,
              order: idx,
              alt_text: img.alt_text,
            };
          }
          const id = uploadedIdByTmp.get(img._tmpId);
          if (!id) throw new Error("Missing created image id");
          return { image_id: id, order: idx, alt_text: img.alt_text };
        });

        if (finalImages.length > 0) {
          await updateSouvenirImages(Number(createdSouvenir.id), finalImages);
        }

        toast.success("Souvenir created successfully", {
          icon: <CheckCircle />,
        });
        router.replace(`/souvenirs/${createdSouvenir.id}`);
        setIsLoading(false);
        return;
      }
      // update
      const _shouldUpdate = shouldUpdate(defaultValues, data);

      if (!_shouldUpdate) {
        toast.info("You have not made any changes to the form.", {
          icon: <AlertCircle />,
        });
        return;
      }
      setHasAttemptedSubmit(true);
      const { images: imagesField, ...rest } = data as any;
      const imgs = imagesField as FileUploaderFormImage[];
      if (imgs && imgs.length > 0) {
        const valid = hasValidImages(imgs);
        if (!valid) return;
      }

      // upload new ones if any
      const images = imagesField as any[];
      const newImages = images.filter((i: any) => i._type === "new");
      const uploadedIdByTmp = new Map<string, number>();
      if (newImages.length > 0) {
        setIsUploading(true);
        const files = newImages.map((i: any) => i.file as File);
        const uploadResults = await uploadFilesWithProgress(
          files,
          (m) => setProgresses(m),
          "/api/v1/upload-image"
        );
        const imageRows: TNewImage[] = uploadResults.map((res, index) => ({
          small_url: res.image.small_url,
          medium_url: res.image.medium_url,
          large_url: res.image.large_url,
          original_url: res.image.original_url,
          alt_text: newImages[index]!.alt_text,
        }));
        const created = await createImages(imageRows);
        created.forEach((row: any, idx: number) => {
          uploadedIdByTmp.set(newImages[idx]!._tmpId, row.id);
        });
        setIsUploading(false);
      }

      // compute final payload
      const final = images.map((img: any, idx: number) => {
        if (img._type === "existing") {
          return { image_id: img.image_id, order: idx, alt_text: img.alt_text };
        }
        const id = uploadedIdByTmp.get(img._tmpId);
        if (!id) throw new Error("Missing created image id");
        return { image_id: id, order: idx, alt_text: img.alt_text };
      });

      // identify deletions
      const initialImageIds = new Set(
        (initialData?.images ?? [])
          .map((pi: any) => pi.image_id)
          .filter((id: any): id is number => id !== null)
      );
      const currentIds = new Set(final.map((f: any) => f.image_id));
      const imagesToDelete = [...initialImageIds].filter(
        (id) => !currentIds.has(id)
      );
      if (imagesToDelete.length > 0) {
        await deleteImages(imagesToDelete);
      }

      // update base and images
      await updateSouvenir(
        initialData.id,
        { ...rest, slug: initialData.slug, park_id: Number(rest.park_id) },
        [],
        []
      );
      await updateSouvenirImages(Number(initialData.id), final);

      toast.success("Souvenir updated successfully", { icon: <CheckCircle /> });
      router.replace(`/souvenirs/${initialData.id}`);
      setIsLoading(false);
      return;
    } catch (error) {
      toast.error(
        initialData ? "Failed to update souvenir" : "Failed to create souvenir",
        { icon: <AlertCircle /> }
      );
      setIsLoading(false);
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
                    <FormLabel>Souvenir Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={(field.value || []) as FileUploaderFormImage[]}
                        onValueChange={(value) => field.onChange(value as any)}
                        multiple
                        maxFiles={8}
                        maxSize={MAX_FILE_SIZE}
                        progresses={progresses}
                        disabled={isLoading || isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Souvenir Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Souvenir name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="park_id"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>National Park</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value?.toString()}
                    >
                      <NationalParkSelect />
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => {
                  return (
                    <FormItem className="col-span-1">
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {Number(field.value) > 0 ? "In Stock" : "Out of Stock"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* <FormField
                control={form.control}
                name="is_available"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Stock Availability</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          field.onChange(value === "in-stock")
                        }
                        defaultValue={field.value ? "in-stock" : "out-of-stock"}
                        className="flex-row flex"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="in-stock" id="in-stock" />
                          <Label htmlFor="in-stock">In Stock</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="out-of-stock"
                            id="out-of-stock"
                          />
                          <Label htmlFor="out-of-stock">Out of Stock</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : buttonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SouvenirForm;
