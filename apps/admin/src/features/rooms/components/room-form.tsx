"use client";

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    addRoomImages, createRoomPlan, deleteRoomPlan, updateRoom, updateRoomPlan
} from '@repo/actions/rooms.actions';

import {
    RoomAmenitiesSection, RoomDetailsSection, RoomImagesSection, RoomPlansSection
} from './sections';

import type { TRoom } from "@repo/db/schema/types";
import type { TRoomBase } from "@repo/db/schema/rooms";

interface RoomFormProps {
  pageTitle?: string;
  mode?: "create" | "edit";
  roomId?: string;
  initialData?: TRoom | null;
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  onNext?: () => void;
  showNext?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection = ({
  title,
  isExpanded,
  onToggle,
  onNext,
  showNext = false,
  children,
}: CollapsibleSectionProps) => {
  return (
    <Card>
      <CardHeader
        className="flex flex-row items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            <div>{children}</div>
            {showNext && onNext && (
              <div className="flex justify-end pt-4 border-t">
                <Button type="button" onClick={onNext} className="px-6">
                  Next Section
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default function RoomForm({
  pageTitle = "Create Room",
  mode = "create",
  roomId,
  initialData,
}: RoomFormProps) {
  // Collapsible sections state - only show room details in create mode
  const [sectionsExpanded, setSectionsExpanded] = useState<{
    roomDetails: boolean;
    images: boolean;
    amenities: boolean;
    plans: boolean;
  }>({
    roomDetails: true,
    images: false,
    amenities: false,
    plans: false,
  });

  // Define section order for navigation
  const sectionOrder: (keyof typeof sectionsExpanded)[] = [
    "roomDetails",
    "images",
    "amenities",
    "plans",
  ];

  // Get next section for a given section
  const getNextSection = (currentSection: keyof typeof sectionsExpanded) => {
    const currentIndex = sectionOrder.indexOf(currentSection);
    return currentIndex < sectionOrder.length - 1
      ? sectionOrder[currentIndex + 1]
      : null;
  };

  // Navigate to next section
  const goToNextSection = (currentSection: keyof typeof sectionsExpanded) => {
    const nextSection = getNextSection(currentSection);
    if (nextSection) {
      setSectionsExpanded((prev) => ({
        ...prev,
        [currentSection]: false,
        [nextSection]: true,
      }));
    }
  };

  // Toggle section expansion
  const toggleSection = (
    section: keyof typeof sectionsExpanded | (keyof typeof sectionsExpanded)[]
  ) => {
    if (typeof section === "string") {
      setSectionsExpanded((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    } else {
      setSectionsExpanded((prev) => ({
        ...prev,
        ...section.reduce(
          (acc, curr) => {
            acc[curr] = !prev[curr];
            return acc;
          },
          {} as Record<string, boolean>
        ),
      }));
    }
  };

  return (
    <div className="mx-auto w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            {pageTitle}
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {/* Room Details Section */}
        <CollapsibleSection
          title="Room Details"
          isExpanded={sectionsExpanded.roomDetails}
          onToggle={() => toggleSection("roomDetails")}
          showNext={mode === "edit" && getNextSection("roomDetails") !== null}
          onNext={() => goToNextSection("roomDetails")}
        >
          <RoomDetailsSection
            onSuccess={
              !!initialData
                ? () => {
                    toggleSection(["roomDetails", "images"]);
                  }
                : undefined
            }
            initialData={initialData as Partial<TRoomBase>}
          />
        </CollapsibleSection>

        {/* Other sections only visible in edit mode */}
        {mode === "edit" && (
          <>
            {/* Images Section */}
            <CollapsibleSection
              title="Images"
              isExpanded={sectionsExpanded.images}
              onToggle={() => toggleSection("images")}
              showNext={getNextSection("images") !== null}
              onNext={() => goToNextSection("images")}
            >
              <RoomImagesSection initialData={initialData} roomId={roomId} />
            </CollapsibleSection>

            {/* Amenities Section */}
            <CollapsibleSection
              title="Amenities"
              isExpanded={sectionsExpanded.amenities}
              onToggle={() => toggleSection("amenities")}
              showNext={getNextSection("amenities") !== null}
              onNext={() => goToNextSection("amenities")}
            >
              <RoomAmenitiesSection initialData={initialData} roomId={roomId} />
            </CollapsibleSection>

            {/* Room Plans Section */}
            <CollapsibleSection
              title="Room Plans"
              isExpanded={sectionsExpanded.plans}
              onToggle={() => toggleSection("plans")}
              showNext={false}
            >
              <RoomPlansSection
                initialData={initialData}
                onSave={async (data: any) => {
                  // Handle room plans save
                  if (data.planId) {
                    await updateRoomPlan(data.planId, data);
                  } else {
                    await createRoomPlan({
                      room_id: Number(roomId),
                      ...data,
                    });
                  }
                  return;
                }}
                roomId={roomId}
              />
            </CollapsibleSection>
          </>
        )}
      </div>
    </div>
  );
}
