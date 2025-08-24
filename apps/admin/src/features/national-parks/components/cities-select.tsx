"use client";

import { useEffect, useState } from "react";

import { FormControl } from "@/components/ui/form";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import type { FieldValues, UseFormWatch, Path } from "react-hook-form";

import type { TCity } from "@repo/db/schema/city";
import type { TState } from "@repo/db/index";

type TCitiesSelectProps<T extends FieldValues> = {
  stateKey: Path<T>;
  watch: UseFormWatch<T>;
};

const getCities = async (stateId: number) => {
  const cities = await fetch(`/api/v1/cities?state=${stateId}`, {
    next: {
      tags: ["cities"],
      revalidate: 60 * 60, // Cache for 1 hour
    },
  }).then((res) => res.json());
  return cities;
};

const CitiesSelect = <T extends FieldValues>(props: TCitiesSelectProps<T>) => {
  const { stateKey, watch } = props;

  const stateId = watch(stateKey);
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<TCity[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const _cities = await getCities(stateId);
        setCities(_cities);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    if (!stateId) return;
    getData();
  }, [stateId]);

  if (isLoading) {
    return (
      <FormControl>
        <Skeleton className="h-9 w-full" />
      </FormControl>
    );
  }

  return (
    <>
      <FormControl className="w-full">
        <SelectTrigger>
          <SelectValue placeholder="Select city" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {!stateId ? (
          <SelectItem disabled value="0">
            Select state first
          </SelectItem>
        ) : cities.length > 0 ? (
          cities.map((city) => (
            <SelectItem key={city.id} value={city.id.toString()}>
              {city.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem disabled value="0">
            No cities found
          </SelectItem>
        )}
      </SelectContent>
    </>
  );
};

export default CitiesSelect;
