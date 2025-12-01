"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileUploader } from "@/components/file-uploader";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ImagesArraySchema, type FormImage } from "@/lib/image-schema";
import { createBlog, updateBlog } from "@repo/actions/blogs.actions";
import { uploadFilesWithProgress } from "@/lib/upload-files";
import { createImages } from "@repo/actions/image.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TBlogCategory, TBlog } from "@repo/db/index";
import { Loader2 } from "lucide-react";
import { CreateCategoryDialog } from "./create-category-dialog";
import { Separator } from "@/components/ui/separator";

// Extending TBlog to include thumbnail and category for initial data type
type BlogWithThumbnail = TBlog & {
  thumbnail: {
    id: number;
    small_url: string;
    medium_url: string;
    large_url: string;
    original_url: string;
    alt_text: string;
  } | null;
  category: TBlogCategory;
};

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category_id: z.coerce.number().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
  // We use an array for the file uploader, but enforce max 1
  thumbnail: ImagesArraySchema(1, 1),
});

type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  initialData?: BlogWithThumbnail | null;
  categories: TBlogCategory[];
  pageTitle?: string;
}

export const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  categories,
  pageTitle,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultThumbnail: FormImage[] = initialData?.thumbnail
    ? [
        {
          _type: "existing",
          image_id: initialData.thumbnail.id,
          order: 0,
          small_url: initialData.thumbnail.small_url,
          medium_url: initialData.thumbnail.medium_url,
          large_url: initialData.thumbnail.large_url,
          original_url: initialData.thumbnail.original_url,
          alt_text: initialData.thumbnail.alt_text,
        },
      ]
    : [];

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      category_id: initialData?.category_id || 0,
      content: initialData?.content || "",
      thumbnail: defaultThumbnail,
    },
  });

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setIsSubmitting(true);

      const thumbnailImage = data.thumbnail[0];
      let thumbnailImageId: number | null = null;

      if (thumbnailImage._type === "existing") {
        thumbnailImageId = thumbnailImage.image_id;
      } else {
        // Upload new image
        const uploadResult = await uploadFilesWithProgress(
          [thumbnailImage.file],
          undefined,
          "/api/v1/upload-image"
        );

        if (!uploadResult[0]) {
          throw new Error("Failed to upload image");
        }

        const createdImage = await createImages([
          {
            small_url: uploadResult[0].image.small_url,
            medium_url: uploadResult[0].image.medium_url,
            large_url: uploadResult[0].image.large_url,
            original_url: uploadResult[0].image.original_url,
            alt_text: thumbnailImage.alt_text,
          },
        ]);

        if (!createdImage[0]) {
          throw new Error("Failed to create image record");
        }
        thumbnailImageId = createdImage[0].id;
      }

      if (!thumbnailImageId) {
        throw new Error("Thumbnail is required");
      }

      if (initialData) {
        await updateBlog(initialData.id, {
          title: data.title,
          category_id: data.category_id,
          content: data.content,
          thumbnail_image_id: thumbnailImageId,
        });
        toast.success("Blog updated successfully");
      } else {
        await createBlog({
          title: data.title,
          category_id: data.category_id,
          content: data.content,
          thumbnail_image_id: thumbnailImageId,
        });
        toast.success("Blog created successfully");
      }
      router.push("/blogs");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full space-y-6">
      {pageTitle && (
        <Card>
          <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
              {pageTitle}
            </CardTitle>
          </CardHeader>
        </Card>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="Blog title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  value={field.value ? field.value.toString() : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <div className="p-2">
                      <CreateCategoryDialog />
                    </div>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail</FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value as unknown as any}
                    onValueChange={field.onChange}
                    maxFiles={1}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isSubmitting} className="ml-auto" type="submit">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Save changes" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
