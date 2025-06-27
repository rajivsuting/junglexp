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

import type { TState } from "@repo/db/index";

const getStates = async () => {
  const states = await fetch("/api/v1/states", {
    cache: "force-cache",
    next: {
      tags: ["states"],
      revalidate: 60 * 60, // Cache for 1 hour
    },
  }).then((res) => res.json());
  return states;
};

const StatesSelect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<TState[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const _states = await getStates();
        setStates(_states);
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
        {states.length > 0 ? (
          states.map((state) => (
            <SelectItem key={state.id} value={state.id.toString()}>
              {state.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem disabled value="0">
            No states found
          </SelectItem>
        )}
      </SelectContent>
    </>
  );
};

export default StatesSelect;
