"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { updateConfiguration } from "@repo/actions/configurations.actions";
import { ConfigurationKeys } from "@repo/db/schema/configurations";

const formSchema = z.object({
  [ConfigurationKeys.home_page_title]: z
    .string()
    .min(1, "Home page title is required"),
  [ConfigurationKeys.home_page_cta_text]: z.string().optional(),
  [ConfigurationKeys.home_page_cta_link]: z.string().optional(),
});

type ConfigurationFormValues = z.infer<typeof formSchema>;

interface ConfigurationFormProps {
  initialData: ConfigurationFormValues;
}

export function ConfigurationForm({ initialData }: ConfigurationFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ConfigurationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      home_page_title: initialData.home_page_title,
      home_page_cta_text: initialData.home_page_cta_text || "",
      home_page_cta_link: initialData.home_page_cta_link || "",
    },
  });

  const onSubmit = async (data: ConfigurationFormValues) => {
    try {
      setLoading(true);

      const arr = [];

      if (data.home_page_title !== initialData.home_page_title) {
        arr.push(
          updateConfiguration(
            ConfigurationKeys.home_page_title,
            data.home_page_title,
            "Title displayed on the home page hero section"
          )
        );
      }
      if (data.home_page_cta_text !== initialData.home_page_cta_text) {
        arr.push(
          updateConfiguration(
            ConfigurationKeys.home_page_cta_text,
            data.home_page_cta_text || "",
            "Text for the CTA button on home page"
          )
        );
      }
      if (data.home_page_cta_link !== initialData.home_page_cta_link) {
        arr.push(
          updateConfiguration(
            ConfigurationKeys.home_page_cta_link,
            data.home_page_cta_link || "",
            "Link URL for the CTA button on home page"
          )
        );
      }

      if (arr.length > 0) {
        await Promise.all(arr);
      }

      toast.success("Configuration updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="home_page_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Page Title</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Plan Your Next Safari"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the main title displayed on the client home page hero
                section. You can use HTML tags like &lt;span&gt;, &lt;br /&gt;
                for formatting.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 justify-start md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="home_page_cta_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA Button Text</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Book Now" {...field} />
                </FormControl>
                <FormDescription>
                  Text to display on the main call-to-action button.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="home_page_cta_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA Button Link</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., /safaris" {...field} />
                </FormControl>
                <FormDescription>
                  The URL the button should link to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
