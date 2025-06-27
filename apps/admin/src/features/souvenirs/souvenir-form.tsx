"use client";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createSlug } from "@/lib/format";
import { UploadResultFormatter } from "@/lib/object-formatter";
import { shouldUpdate } from "@/lib/should-update";
import { uploadFiles } from "@/lib/upload-files";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSouvenir,
  updateSouvenir,
} from "@repo/actions/souvenirs.actions";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@repo/db/utils/file-utils";

import NationalParkSelect from "./components/park-select";

import type { TSouvenir } from "@repo/db/index";
import type { TNewImage } from "@repo/db/schema/image";
type TSouvenirFormProps = {
  initialData: TSouvenir | null;
  pageTitle: string;
};

const formSchema = z.object({
  name: z.string().min(1, "National Park name is required.").max(255),
  description: z.string().min(1, "National Park description is required."),
  price: z.number().min(1, "National Park price is required."),
  images: z
    .any()
    .refine((files) => {
      console.log("files", files.length);

      return files?.length == 1, "Image is required.";
    })
    .refine(
      (files) => (files?.[0]?.url ? true : files?.[0]?.size <= MAX_FILE_SIZE),
      `Max file size is 5MB.`
    )
    .refine(
      (files) =>
        files?.[0]?.url
          ? true
          : ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  park_id: z.string().min(1, "National Park is required."),
  is_available: z.boolean().default(false),
});

const SouvenirForm = (props: TSouvenirFormProps) => {
  const { initialData, pageTitle } = props;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    images:
      initialData?.images?.map((image) => ({
        url: image.image.small_url,
        image_id: image.image_id,
        name: image.image.original_url.split("/").pop() || "",
      })) || [],
    park_id: initialData?.park_id ? initialData.park_id.toString() : "",
    is_available: initialData?.is_available || false,
  };

  const buttonText = initialData ? "Update Souvenir" : "Create Souvenir";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const getNewImages = (newImages: any) => {
    return newImages.filter((_image: any) => !_image.image_id);
  };

  const getImagesToDelete = (newImages: any, initialData: TSouvenir) => {
    return (
      initialData?.images?.filter(
        (image) => !newImages.find((im: any) => im.image_id == image.image_id)
      ) || []
    );
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!initialData) {
        //create
        setIsLoading(true);
        const { images: newImages, ...rest } = data;
        const images = await uploadFiles(newImages);

        const imagesToStore = new UploadResultFormatter(
          images
        ).formatToDBImages();

        const result = await createSouvenir(
          {
            ...rest,
            slug: createSlug(rest.name),
            park_id: Number(rest.park_id),
          },
          imagesToStore
        );

        toast.success("Souvenir created successfully", {
          icon: <CheckCircle />,
        });

        router.replace(`/admin/souvenirs/${result.data.id}`);
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
      const { images: newImages, ...rest } = data;

      const newImagesToUpload = getNewImages(newImages);

      const imagesToDelete = getImagesToDelete(newImages, initialData);

      let newImagesToStore: TNewImage[] = [];

      if (newImagesToUpload.length > 0) {
        const imageResult = await uploadFiles(newImagesToUpload);

        newImagesToStore = new UploadResultFormatter(
          imageResult
        ).formatToDBImages();
      }
      const result = await updateSouvenir(
        initialData.id,
        {
          ...rest,
          slug: initialData.slug,
          park_id: Number(rest.park_id),
        },
        newImagesToStore,
        imagesToDelete.map((image) => image.image_id)
      );
      toast.success("Souvenir updated successfully", {
        icon: <CheckCircle />,
      });
      router.replace(`/souvenirs/${result.data.id}`);
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
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={4}
                        maxSize={4 * 1024 * 1024}
                        // disabled={loading}
                        // progresses={progresses}
                        // pass the onUpload function here for direct upload
                        // onUpload={uploadFiles}
                        // disabled={isUploading}
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
              />
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
