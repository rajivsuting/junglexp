"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getNationalParks } from "@repo/actions/parks.actions";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface NationalPark {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface NationalParkSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onParkChange?: (parkId: string | undefined) => void;
}

export const NationalParkSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label = "National Park",
  placeholder = "Select a national park",
  disabled = false,
  required = false,
  onParkChange,
}: NationalParkSelectProps<TFieldValues, TName>) => {
  const [parks, setParks] = useState<NationalPark[]>([]);
  const [isLoadingParks, setIsLoadingParks] = useState(true);

  // Fetch national parks on component mount
  useEffect(() => {
    const fetchParks = async () => {
      try {
        setIsLoadingParks(true);
        const { parks: fetchedParks } = await getNationalParks({ limit: 100 });
        setParks(fetchedParks);
      } catch (error) {
        console.error("Error fetching national parks:", error);
        toast.error("Failed to fetch national parks.");
      } finally {
        setIsLoadingParks(false);
      }
    };

    fetchParks();
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && " *"}
          </FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onParkChange?.(value);
            }}
            value={field.value}
            disabled={disabled || isLoadingParks}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingParks ? "Loading parks..." : placeholder
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {parks.map((park) => (
                <SelectItem key={park.id} value={park.id.toString()}>
                  {park.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
