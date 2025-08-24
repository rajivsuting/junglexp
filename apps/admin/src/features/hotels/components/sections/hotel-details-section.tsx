"use client";

import { Loader2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
import { createNewHotel, updateHotel } from "@repo/actions/hotels.actions";

import { NationalParkSelect } from "./national-park-select";
import { ZoneSelect } from "./zone-select";

import type { THotelBase } from "@repo/db/schema/hotels";
import type { THotel } from "@repo/db/index";

// Hotel types based on schema
const HOTEL_TYPES = [
  { value: "resort", label: "Resort" },
  { value: "forest", label: "Forest" },
  { value: "home", label: "Home" },
] as const;

// Rating options (1-5 stars)
const RATING_OPTIONS = [1, 2, 3, 4, 5];

// Hotel Details schema
const hotelDetailsSchema = z.object({
  name: z.string().min(1, "Hotel name is required").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  park_id: z.string().min(1, "National Park is required"),
  zone_id: z.string().min(1, "Zone is required"),
  hotel_type: z.enum(["resort", "forest"], {
    required_error: "Hotel type is required",
  }),
  rating: z.coerce.number().min(1, "Rating is required").max(5),
});

type HotelDetailsFormData = z.infer<typeof hotelDetailsSchema>;

interface HotelDetailsSectionProps {
  initialData?: Partial<THotel>;
  onSuccess?: (hotelId: string) => void;
}

const StarRating = ({
  rating,
  onRatingChange,
  disabled = false,
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}) => {
  return (
    <div className="flex items-center gap-1">
      {RATING_OPTIONS.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && onRatingChange(star)}
          disabled={disabled}
          className={`p-1 rounded transition-colors ${
            disabled ? "cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          <Star
            className={`w-6 h-6 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {rating} {rating === 1 ? "star" : "stars"}
      </span>
    </div>
  );
};

export const HotelDetailsSection = ({
  initialData,
  onSuccess,
}: HotelDetailsSectionProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("initialData", initialData);

  const defaultValues = useMemo(() => {
    return {
      name: initialData?.name || "",
      description: initialData?.description || "",
      park_id: initialData?.zone?.park.id.toString(),
      zone_id: initialData?.zone_id?.toString() || "",
      hotel_type: initialData?.hotel_type || undefined,
      rating: initialData?.rating || 1,
    };
  }, [initialData]);

  const form = useForm<HotelDetailsFormData>(
    useMemo(
      () => ({
        resolver: zodResolver(hotelDetailsSchema),
        defaultValues: defaultValues,
        mode: "onChange", // Enable validation on change for better UX
      }),
      [defaultValues]
    )
  );

  console.log(form.getValues());

  // Watch for park selection changes to reset zone
  const selectedParkId = form.watch("park_id");

  // Track if form has been modified (dirty state)
  const {
    formState: { isDirty, isValid },
  } = form;

  const handleParkChange = (parkId: string | undefined) => {
    // Reset zone selection when park changes
    if (parkId !== selectedParkId) {
      form.setValue("zone_id", "", { shouldDirty: true });
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  };

  const handleCreateHotel = async (data: HotelDetailsFormData) => {
    try {
      setIsSubmitting(true);
      if (initialData) {
        try {
          const slug = generateSlug(data.name);
          const result = await updateHotel(initialData.id!, {
            name: data.name,
            description: data.description,
            slug: slug,
          });
          toast.success("Hotel updated successfully");

          onSuccess?.(result?.id.toString() || "");
          return;
        } catch (error) {
          console.error("Error creating hotel:", error);
          toast.error("Failed to update hotel. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }

      // Generate slug from name
      const slug = generateSlug(data.name);

      const result = await createNewHotel({
        name: data.name,
        description: data.description,
        slug: slug,
        zone_id: Number(data.zone_id),
        hotel_type: data.hotel_type,
        rating: data.rating,
      });
      toast.success("Hotel created successfully");

      // Call success callback or redirect
      if (result && typeof result === "object" && "id" in result) {
        if (onSuccess) {
          onSuccess(result.id.toString());
        } else {
          router.push(`/hotels/${result.id}`);
        }
      } else {
        form.reset();
      }
    } catch (error) {
      console.error("Error creating hotel:", error);
      toast.error("Failed to create hotel. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateHotel)}
        className="space-y-6"
      >
        {/* Hotel Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter hotel name"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter hotel description"
                  className="min-h-[100px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* National Park Selection */}
          <NationalParkSelect
            control={form.control}
            name="park_id"
            label="National Park"
            placeholder="Select a national park"
            disabled={isSubmitting}
            required={true}
            onParkChange={handleParkChange}
          />

          {/* Zone Selection */}
          <ZoneSelect
            control={form.control}
            name="zone_id"
            label="Zone"
            placeholder="Select a zone"
            disabled={isSubmitting}
            required={true}
            parkId={selectedParkId}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hotel Type */}
          <FormField
            control={form.control}
            name="hotel_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotel Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hotel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {HOTEL_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating *</FormLabel>
                <FormControl>
                  <div className="pt-2">
                    <StarRating
                      rating={field.value}
                      onRatingChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Create/Update Hotel Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || (!!initialData && !isDirty) || !isValid}
            className="w-full md:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting
              ? initialData
                ? "Updating..."
                : "Creating..."
              : !!initialData
                ? "Update Hotel"
                : "Create Hotel"}
          </Button>
          {!!initialData && !isDirty && (
            <p className="text-sm text-muted-foreground mt-2">
              Make changes to enable the update button
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};
