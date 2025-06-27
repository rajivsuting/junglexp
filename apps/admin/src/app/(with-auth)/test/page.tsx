"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { IconSelectButton } from "@/components/icon-select";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { uploadFile } from "@/lib/upload-files";

export default function TestPage() {
  const [data, setData] = useState<any>([]);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const result = await uploadFile(file);
    console.log("result", result);
    setData(result.variants);
  };

  const form = useForm({
    defaultValues: {
      icon: "Search",
    },
  });

  const onSubmit = (data: any) => {
    console.log("data", data);
  };
  return (
    <PageContainer scrollable>
      <div>
        <input type="file" onChange={handleFileChange} />

        <div>
          {data.map((item: any) => (
            <div key={item.url}>
              <Image
                unoptimized
                width={item.width}
                alt=""
                height={item.height}
                src={`http://localhost:3001${item.url}`}
              />
            </div>
          ))}
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <IconSelectButton
                    onIconSelect={(icon) => field.onChange(icon)}
                    selectedIcon={field.value}
                    searchPlaceholder="Search for an icon..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>{" "}
    </PageContainer>
  );
}
