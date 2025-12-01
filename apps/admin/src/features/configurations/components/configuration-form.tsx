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
import { updateConfiguration } from "@repo/actions/configurations.actions";

const formSchema = z.object({
  home_page_title: z.string().min(1, "Home page title is required"),
});

type ConfigurationFormValues = z.infer<typeof formSchema>;

interface ConfigurationFormProps {
  initialData: ConfigurationFormValues;
}

export function ConfigurationForm({ initialData }: ConfigurationFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ConfigurationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ConfigurationFormValues) => {
    try {
      setLoading(true);
      await updateConfiguration("home_page_title", data.home_page_title, "Title displayed on the home page hero section");
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
                This is the main title displayed on the client home page hero section. You can use HTML tags like &lt;span&gt;, &lt;br /&gt; for formatting.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}

