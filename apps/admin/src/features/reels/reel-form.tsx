"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { uploadVideo } from '@/lib/video-upload';
import { zodResolver } from '@hookform/resolvers/zod';
import { createReel, updateReel } from '@repo/actions/reels.actions';

import type { TReelBase } from "@repo/db/schema/reels";
const createSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    videoUrl: z.string().url().optional(),
    videoFile: z.instanceof(File).superRefine(async (file, ctx) => {
      if (!file) return;
      const ok = await new Promise<boolean>((resolve) => {
        const url = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          const width = video.videoWidth || 0;
          const height = video.videoHeight || 0;
          URL.revokeObjectURL(url);
          if (width === 0 || height === 0) {
            resolve(false);
            return;
          }
          const ratio = width / height;
          const target = 9 / 16;
          const tolerance = 0.02;
          resolve(Math.abs(ratio - target) <= tolerance);
        };
        video.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(false);
        };
        video.src = url;
      });
      if (!ok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Video must be in 9:16 aspect ratio (portrait).",
        });
      }
    }),
    redirectUrl: z.string(),
    isInternal: z.boolean().default(true),
    isExternal: z.boolean().default(false),
    status: z.enum(["active", "inactive"]).default("active"),
  })
  .refine((data) => !(data.isInternal && data.isExternal), {
    message: "Choose either Internal or External, not both.",
    path: ["isInternal"],
  })
  .refine((data) => data.isInternal || data.isExternal, {
    message: "Select Internal or External.",
    path: ["isInternal"],
  })
  .refine(
    (data) => {
      if (!data.redirectUrl) return true;
      if (data.isInternal) return data.redirectUrl.startsWith("/");
      if (data.isExternal) return data.redirectUrl.startsWith("https://");
      return true;
    },
    {
      message:
        "Internal URLs must start with /; External URLs must start with https://",
      path: ["redirectUrl"],
    }
  );

const updateSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    videoUrl: z.string().url(),
    redirectUrl: z.string(),
    isInternal: z.boolean().default(true),
    isExternal: z.boolean().default(false),
    status: z.enum(["active", "inactive"]).default("active"),
  })
  .refine((data) => !(data.isInternal && data.isExternal), {
    message: "Choose either Internal or External, not both.",
    path: ["isInternal"],
  })
  .refine((data) => data.isInternal || data.isExternal, {
    message: "Select Internal or External.",
    path: ["isInternal"],
  })
  .refine(
    (data) => {
      if (!data.redirectUrl) return true;
      if (data.isInternal) return data.redirectUrl.startsWith("/");
      if (data.isExternal) return data.redirectUrl.startsWith("https://");
      return true;
    },
    {
      message:
        "Internal URLs must start with /; External URLs must start with https://",
      path: ["redirectUrl"],
    }
  );

type ReelFormProps = {
  initialData: TReelBase | null;
  pageTitle: string;
};

export default function ReelForm({ initialData, pageTitle }: ReelFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(initialData?.id);

  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(isEdit ? (updateSchema as any) : createSchema),
  });

  const updatefFrm = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      videoUrl: initialData?.videoUrl ?? "",
      redirectUrl: initialData?.redirectUrl ?? "",
      isInternal: initialData?.redirectUrl?.startsWith("/") ?? false,
      isExternal: initialData?.redirectUrl?.startsWith("https://") ?? false,
      status: (initialData?.status as any) ?? "active",
    },
  });

  const currentForm = isEdit ? (updatefFrm as any) : form;

  const onSubmitUpdate = async (data: z.infer<typeof updateSchema>) => {
    console.log("onSubmit", data);
    try {
      setLoading(true);
      await updateReel(initialData?.id ?? "", {
        title: data.title,
        description: data.description,
        redirectUrl: data.redirectUrl,
        status: data.status,
      });
      toast.success("Reel updated successfully");
      router.push(`/reels/${initialData?.id}`);
    } catch (err) {
      toast.error("Failed to update reel");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof createSchema>) => {
    try {
      setLoading(true);
      // Enforce conditional requirement

      const buffer = await data.videoFile.arrayBuffer();
      const { url } = await uploadVideo({
        data: buffer,
        fileName: data.videoFile.name,
        contentType: data.videoFile.type,
      });

      if (!url) {
        setLoading(false);
        toast.error("Failed to upload video");
        return;
      }
      // For create, you'll likely upload the file and set videoUrl to the uploaded URL on server
      const inserted = await createReel({
        ...data,
        videoUrl: url,
      } as any);
      if (inserted) {
        toast.success("Reel created successfully");
        router.push(`/reels/${inserted.id}`);
        return;
      }
    } catch (err) {
      toast.error("Failed to create reel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...currentForm}>
          <form
            onSubmit={
              isEdit
                ? updatefFrm.handleSubmit(onSubmitUpdate)
                : form.handleSubmit(onSubmit)
            }
            className="space-y-6"
          >
            <FormField
              control={currentForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={currentForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEdit ? (
              <FormField
                control={currentForm.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="https://example.com/video.mp4 or /videos/video.mp4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={currentForm.control}
                name="videoFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file || undefined);
                        }}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Only one video file allowed
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-6">
                <FormField
                  control={currentForm.control}
                  name="isInternal"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            const on = Boolean(checked);
                            form.setValue("isInternal", on, {
                              shouldDirty: true,
                            });
                            if (on)
                              form.setValue("isExternal", false, {
                                shouldDirty: true,
                              });
                          }}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">
                        Internal URL
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={currentForm.control}
                  name="isExternal"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            const on = Boolean(checked);
                            form.setValue("isExternal", on, {
                              shouldDirty: true,
                            });
                            if (on)
                              form.setValue("isInternal", false, {
                                shouldDirty: true,
                              });
                          }}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">
                        External URL
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={currentForm.control}
                name="redirectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redirect URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/path for internal or https://example.com for external"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Internal must start with /, External must start with
                      https://
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={currentForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={!currentForm.formState.isDirty || loading}
              onClick={() => {
                // Ensure redirect URL validation runs according to selection
                currentForm.trigger([
                  "redirectUrl",
                  "isInternal",
                  "isExternal",
                ]);
              }}
            >
              {loading
                ? "Saving..."
                : initialData
                  ? "Update Reel"
                  : "Create Reel"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
