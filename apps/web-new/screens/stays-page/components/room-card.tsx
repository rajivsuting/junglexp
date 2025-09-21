"use client";

import { Bed, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { RoomAmenitiesSection } from './room-amenities-section';

import type { TRoom } from "@repo/db/schema/types";

interface RoomCardProps {
  room: TRoom;
  onReserve: () => void;
}

const mealPlanOptions = {
  EP: "European Plan (Room only)",
  CP: "Continental Plan (Room + Breakfast)",
  MAP: "Modified American Plan (Room + Breakfast + Dinner)",
  AP: "American Plan (All meals included)",
} as const;

export function RoomCard({ room, onReserve }: RoomCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + room.images.length) % room.images.length
    );
  };

  // Pricing from selected plan
  const pricing = useMemo(() => {
    const plan =
      room.plans.find((p) => p.id === selectedPlanId) ?? room.plans[0];
    if (!plan) return null;
    const price = Number(plan.price);
    const discount = 0;
    const discountedPrice = price * (1 - discount / 100);
    const totalPrice = discountedPrice * 1.18;
    return {
      originalPrice: price,
      discountedPrice: Math.round(discountedPrice),
      discount,
      totalPrice: Math.round(totalPrice),
    };
  }, [room.plans, selectedPlanId]);

  const hasImages = room.images && room.images.length > 0;

  return (
    <Card className="overflow-hidden text-primary pt-0 shadow-lg">
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

      <CardContent className="p-6 pt-2">
        {/* Room Name and Rating */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">{room.name}</h3>
          <span className="text-sm">{room.description}</span>
          {/* <div className="flex items-center gap-2">
            <Badge className="bg-green-600 hover:bg-green-700 text-white font-bold">
              9.5
            </Badge>
            <span className="text-gray-600 font-medium">Exceptional</span>
            <span className="text-gray-500">4 reviews</span>
          </div> */}
        </div>

        {/* Amenities */}
        {/* <div className="space-y-2 mb-4">
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
        </div> */}

        {/* Room Details */}

        {/* Room Amenities (condensed) */}
        <div className="mb-6">
          <RoomAmenitiesSection amenities={room.amenities} maxItems={10} />
        </div>

        <Separator className="mb-6" />

        {/* Room Plans - single-select checkbox group */}
        {room.plans && room.plans.length > 0 ? (
          <div className="mb-6 space-y-3">
            <h4 className="text-sm font-semibold">Select a plan</h4>
            <div className="grid grid-cols-1 gap-2">
              {room.plans.map((plan) => {
                const checked = selectedPlanId === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`flex items-center justify-between rounded-md border px-3 py-2 gap-2 text-left transition-colors ${
                      checked
                        ? "border-primary bg-primary/20"
                        : "hover:bg-primary/10"
                    }`}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <div
                        className={`h-4 w-4 rounded-sm border flex items-center justify-center ${
                          checked
                            ? "bg-primary/20 border-primary"
                            : "border-primary/40"
                        }`}
                        aria-checked={checked}
                        role="checkbox"
                        aria-label={`Select ${plan.plan_type} plan`}
                      >
                        {checked ? (
                          <span className="h-2 w-2 bg-white block" />
                        ) : null}
                      </div>
                      <Label className="m-0 flex-1 cursor-pointer">
                        {mealPlanOptions[plan.plan_type]}
                      </Label>
                    </div>
                    <div className="text-sm font-medium text-primary">
                      ₹{Number(plan.price).toLocaleString("en-IN")}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Pricing Section */}
        {pricing ? (
          <div className="mb-6">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                ₹{pricing.discountedPrice.toLocaleString("en-IN")}
              </div>
              {pricing.discount > 0 ? (
                <div className="text-sm text-gray-500 line-through">
                  ₹{pricing.originalPrice.toLocaleString("en-IN")}
                </div>
              ) : null}
            </div>
            <div className="text-xs">
              Incl. taxes: ₹{pricing.totalPrice.toLocaleString("en-IN")}
            </div>
          </div>
        ) : null}

        {/* Reserve Button */}
        <Button
          disabled={
            (room.plans.length == 0 && selectedPlanId == null) ||
            selectedPlanId == undefined
          }
          onClick={onReserve}
          className="w-full  bg-[#2F2F2F] text-white hover:bg-[#444444] text-white py-3"
        >
          Reserve
        </Button>

        <p className="text-center text-sm mt-2">You will not be charged yet</p>
      </CardContent>
    </Card>
  );
}
