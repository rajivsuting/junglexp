"use client";

import { Bed, Car, ChevronLeft, ChevronRight, Coffee, Expand, Users, Wifi } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { TRoom } from "@repo/db/schema/types";

interface RoomCardProps {
  room: TRoom;
  onReserve: () => void;
}

export function RoomCard({ room, onReserve }: RoomCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + room.images.length) % room.images.length
    );
  };

  // Helper function to check if amenity exists
  const hasAmenity = (amenityName: string) => {
    return room.amenities.some((amenity) =>
      amenity.amenity?.label?.toLowerCase().includes(amenityName.toLowerCase())
    );
  };

  // Helper function to get room pricing (using first plan as example)
  const getRoomPricing = () => {
    const firstPlan = room.plans[0];
    if (!firstPlan) {
      return {
        originalPrice: 0,
        discountedPrice: 0,
        discount: 0,
        totalPrice: 0,
      };
    }

    const price = Number(firstPlan.price);
    const discount = 10; // You can calculate this based on your business logic
    const discountedPrice = price * (1 - discount / 100);
    const totalPrice = discountedPrice * 1.18; // Adding 18% tax

    return {
      originalPrice: price,
      discountedPrice: Math.round(discountedPrice),
      discount,
      totalPrice: Math.round(totalPrice),
    };
  };

  const pricing = getRoomPricing();
  const hasImages = room.images && room.images.length > 0;

  return (
    <Card className="overflow-hidden pt-0 shadow-lg">
      {/* Image Section with Navigation */}
      <div className="relative h-64">
        {hasImages ? (
          <Image
            src={
              room.images[currentImageIndex]?.image?.small_url ||
              room.images[currentImageIndex]?.image?.original_url ||
              "/hero-images/image-1.avif"
            }
            alt={room.images[currentImageIndex]?.image?.alt_text || room.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Bed className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Navigation Buttons - only show if multiple images */}
        {hasImages && room.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {hasImages && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
            <Expand className="w-3 h-3" />
            {room.images.length}
          </div>
        )}
      </div>

      <CardContent className="p-6">
        {/* Room Name and Rating */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600 hover:bg-green-700 text-white font-bold">
              9.5
            </Badge>
            <span className="text-gray-600 font-medium">Exceptional</span>
            <span className="text-gray-500">4 reviews</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-2 mb-4">
          {hasAmenity("breakfast") && (
            <div className="flex items-center gap-2 text-green-600">
              <Coffee className="w-4 h-4" />
              <span className="text-sm">Free breakfast</span>
            </div>
          )}
          {hasAmenity("parking") && (
            <div className="flex items-center gap-2 text-green-600">
              <Car className="w-4 h-4" />
              <span className="text-sm">Free self parking</span>
            </div>
          )}
        </div>

        {/* Room Details */}
        <div className="space-y-2 mb-4 text-gray-700">
          <div className="flex items-center gap-2">
            <Expand className="w-4 h-4" />
            <span className="text-sm">302 sq ft</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Sleeps {room.capacity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4" />
            <span className="text-sm">1 King Bed OR 2 Single Beds</span>
          </div>
        </div>

        {/* Additional Amenities */}
        <div className="space-y-2 mb-6">
          {hasAmenity("dinner") && (
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-sm">✓ Free dinner</span>
            </div>
          )}
          {hasAmenity("wifi") && (
            <div className="flex items-center gap-2 text-gray-700">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">Free WiFi</span>
            </div>
          )}
        </div>

        {/* More Details Link */}
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-6 flex items-center gap-1">
          More details
          <ChevronRight className="w-4 h-4" />
        </button>

        <Separator className="mb-6" />

        {/* Pricing Section */}
        <div className="mb-6">
          {/* Discount Badge */}
          {pricing.discount > 0 && (
            <Badge className="bg-green-600 hover:bg-green-700 text-white mb-2">
              {pricing.discount}% off
            </Badge>
          )}

          <div className="flex items-baseline gap-2 mb-1">
            {pricing.discount > 0 && (
              <span className="text-gray-500 line-through text-sm">
                ₹{pricing.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-2xl font-bold text-gray-900">
              ₹{pricing.discountedPrice.toLocaleString()}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            ₹{pricing.totalPrice.toLocaleString()} total
          </div>
          <div className="text-sm text-gray-600">includes taxes & fees</div>

          {/* Availability */}
          <div className="text-red-600 text-sm mt-2">
            We have {room.room_qty} left
          </div>
        </div>

        {/* Reserve Button */}
        <Button
          onClick={onReserve}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-lg"
        >
          Reserve
        </Button>

        <p className="text-center text-gray-500 text-sm mt-2">
          You will not be charged yet
        </p>
      </CardContent>
    </Card>
  );
}
