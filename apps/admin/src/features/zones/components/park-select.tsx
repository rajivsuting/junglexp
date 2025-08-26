"use client";

import { useEffect, useState } from "react";

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getNationalParks } from "@repo/actions/parks.actions";

type TParksSelectProps = {
  watch?: any;
  stateKey?: string;
};

export default function ParksSelect({ watch, stateKey }: TParksSelectProps) {
  const [parks, setParks] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParks = async () => {
      try {
        setLoading(true);
        const { parks: parksData } = await getNationalParks();
        setParks(parksData.map((park) => ({ id: park.id, name: park.name })));
      } catch (error) {
        console.error("Error fetching parks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParks();
  }, []);

  return (
    <>
      <SelectTrigger>
        <SelectValue
          placeholder={loading ? "Loading parks..." : "Select a park"}
        />
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <SelectItem value="loading" disabled>
            Loading parks...
          </SelectItem>
        ) : parks.length === 0 ? (
          <SelectItem value="no-parks" disabled>
            No parks available
          </SelectItem>
        ) : (
          parks.map((park) => (
            <SelectItem key={park.id} value={park.id.toString()}>
              {park.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </>
  );
}
