"use client";

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { getZones } from '@repo/actions/zones.actions';

import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface Zone {
  id: number;
  name: string;
  description: string;
  park?: {
    id: number;
    name: string;
  };
}

interface ZoneSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  parkId?: string;
  onZoneChange?: (zoneId: string | undefined) => void;
}

export const ZoneSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label = "Zone",
  placeholder = "Select a zone",
  disabled = false,
  required = false,
  parkId,
  onZoneChange,
}: ZoneSelectProps<TFieldValues, TName>) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoadingZones, setIsLoadingZones] = useState(false);

  // Fetch zones when parkId changes
  useEffect(() => {
    const fetchZonesByPark = async () => {
      if (!parkId) {
        setZones([]);
        return;
      }

      try {
        setIsLoadingZones(true);
        const { zones: fetchedZones } = await getZones({
          park: Number(parkId),
          limit: 100,
        });
        setZones(fetchedZones);
      } catch (error) {
        console.error("Error fetching zones:", error);
        toast.error("Failed to fetch zones for selected park.");
      } finally {
        setIsLoadingZones(false);
      }
    };

    fetchZonesByPark();
  }, [parkId]);

  const isSelectDisabled = disabled || isLoadingZones || !parkId;

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
              onZoneChange?.(value);
            }}
            value={field.value}
            disabled={isSelectDisabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !parkId
                      ? "Select a park first"
                      : isLoadingZones
                        ? "Loading zones..."
                        : placeholder
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {zones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id.toString()}>
                  <div className="flex flex-col items-start">
                    <span>{zone.name}</span>
                  </div>
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
