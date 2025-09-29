"use client";

import { Hotel } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { getHotels } from '@repo/actions';

type Hotel = {
  id: number;
  name: string;
};

interface HotelSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function HotelSelect({
  value,
  onValueChange,
  placeholder = "Select a hotel",
  disabled = false,
}: HotelSelectProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true);
        const { hotels: fetchedHotels } = await getHotels({
          limit: 1000, // Get all hotels for selection
        });

        // Map to simple hotel objects for selection
        const hotelOptions = fetchedHotels.map((hotel) => ({
          id: hotel.id!,
          name: hotel.name,
        }));

        setHotels(hotelOptions);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={isLoading ? "Loading hotels..." : placeholder}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Hotels</SelectItem>
        {hotels.map((hotel) => (
          <SelectItem key={hotel.id} value={hotel.id.toString()}>
            <div className="flex items-center gap-2">
              <Hotel className="h-4 w-4 text-muted-foreground" />
              <span>{hotel.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
