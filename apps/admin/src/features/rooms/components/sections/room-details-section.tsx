"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { getHotels } from "@repo/actions/hotels.actions";
import { createRoom, updateRoom } from "@repo/actions/rooms.actions";

import type { TRoomBase } from "@repo/db/schema/rooms";
import type { THotel } from "@repo/db/schema/types";

// Room Details schema
const roomDetailsSchema = z.object({
  name: z.string().min(1, "Room name is required").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  room_qty: z.number().min(1, "Room quantity must be at least 1"),
  capacity: z.number().min(1, "Room capacity must be at least 1"),
  hotel_id: z.number().min(1, "Hotel selection is required"),
});

type RoomDetailsFormData = z.infer<typeof roomDetailsSchema>;

interface RoomDetailsSectionProps {
  initialData?: Partial<TRoomBase>;
  onSuccess?: () => void;
}

export default function RoomDetailsSection({
  initialData,
  onSuccess,
}: RoomDetailsSectionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<THotel[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);

  const isEditMode = !!initialData?.id;

  const form = useForm<RoomDetailsFormData>({
    resolver: zodResolver(roomDetailsSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      room_qty: initialData?.room_qty || 1,
      capacity: initialData?.capacity || 2,
      hotel_id: initialData?.hotel_id || undefined,
    },
  });

  // Load hotels for the select dropdown
  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoadingHotels(true);
        const { hotels: hotelsList } = await getHotels({
          page: 1,
          limit: 1000,
        });
        setHotels(hotelsList);
      } catch (error) {
        console.error("Failed to load hotels:", error);
        toast.error("Failed to load hotels");
      } finally {
        setLoadingHotels(false);
      }
    };

    loadHotels();
  }, []);

  const handleCreateRoom = async (data: RoomDetailsFormData) => {
    try {
      const newRoom = await createRoom(data);
      toast.success("Room created successfully");
      router.push(`/rooms/${newRoom.id}`);
      return newRoom;
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room");
      throw error;
    }
  };

  const handleUpdateRoom = async (data: RoomDetailsFormData) => {
    if (!initialData?.id) return;

    try {
      const updatedRoom = await updateRoom(initialData.id, data);
      toast.success("Room updated successfully");
      onSuccess?.();
      return updatedRoom;
    } catch (error) {
      console.error("Failed to update room:", error);
      toast.error("Failed to update room");
      throw error;
    }
  };

  const onSubmit = async (data: RoomDetailsFormData) => {
    setIsLoading(true);
    try {
      if (isEditMode) {
        await handleUpdateRoom(data);
      } else {
        await handleCreateRoom(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter room name"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hotel_id"
            render={({ field }) => (
              <FormItem className="w-full max-w-[400px]">
                <FormLabel>Hotel *</FormLabel>
                <Select
                  disabled={isLoading || loadingHotels}
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl className="w-full">
                    <SelectTrigger className="max-w-full w-full [&>span]:truncate">
                      <SelectValue placeholder="Select a hotel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hotels.map((hotel) => (
                      <SelectItem
                        className="whitespace-normal break-words"
                        key={hotel.id}
                        value={hotel.id.toString()}
                      >
                        {hotel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity (Guests) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter guest capacity"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isLoading}
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="room_qty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Quantity *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter number of rooms"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isLoading}
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter room description"
                  className="min-h-[100px]"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Create/Update Room Button */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Room" : "Create Room"}
          </Button>

          {!isEditMode && (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/rooms")}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
