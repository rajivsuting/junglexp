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

import type { TNationalPark } from "@repo/db/index";

const NationalParkSelect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [parks, setParks] = useState<TNationalPark[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const _parks = await fetch("/api/v1/national-parks").then((res) =>
          res.json()
        );
        setParks(_parks?.parks);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    getData();
  }, []);

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
          <SelectValue placeholder="Select state" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {parks.length > 0 ? (
          parks.map((park) => (
            <SelectItem key={park.id} value={park.id.toString()}>
              {park.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem disabled value="0">
            No Parks found
          </SelectItem>
        )}
      </SelectContent>
    </>
  );
};

export default NationalParkSelect;
