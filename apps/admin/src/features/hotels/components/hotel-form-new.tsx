"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  updateHotel,
  updateHotelAmenities,
  updateHotelFaqs,
  updateHotelPolicies,
  updateHotelSafetyFeatures,
} from "@repo/actions/hotels.actions";

import {
  HotelAmenitiesSection,
  HotelDetailsSection,
  HotelExcludesSection,
  HotelFaqsSection,
  HotelImagesSection,
  HotelIncludesSection,
  HotelSafetyFeaturesSection,
} from "./sections";

import type { THotel } from "@repo/db/schema/types";
import type { THotelBase } from "@repo/db/schema/hotels";
interface HotelFormProps {
  pageTitle?: string;
  mode?: "create" | "edit";
  hotelId?: string;
  initialData?: THotel | null;
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

export default function HotelForm({
  pageTitle = "Create Hotel",
  mode = "create",
  hotelId,
  initialData,
}: HotelFormProps) {
  // Collapsible sections state - only show hotel details in create mode
  const [sectionsExpanded, setSectionsExpanded] = useState<{
    hotelDetails: boolean;
    images: boolean;
    includes: boolean;
    excludes: boolean;
    amenities: boolean;
    safetyFeatures: boolean;
    faqs: boolean;
  }>({
    hotelDetails: true,
    images: false,
    includes: false,
    excludes: false,
    amenities: false,
    safetyFeatures: false,
    faqs: false,
  });

  // Define section order for navigation
  const sectionOrder: (keyof typeof sectionsExpanded)[] = [
    "hotelDetails",
    "images",
    "includes",
    "excludes",
    "amenities",
    "safetyFeatures",
    "faqs",
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
        {/* Hotel Details Section */}
        <CollapsibleSection
          title="Hotel Details"
          isExpanded={sectionsExpanded.hotelDetails}
          onToggle={() => toggleSection("hotelDetails")}
          showNext={mode === "edit" && getNextSection("hotelDetails") !== null}
          onNext={() => goToNextSection("hotelDetails")}
        >
          <HotelDetailsSection
            onSuccess={
              !!initialData
                ? () => {
                    toggleSection(["hotelDetails", "images"]);
                  }
                : undefined
            }
            initialData={initialData as Partial<THotelBase>}
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
              <HotelImagesSection initialData={initialData} hotelId={hotelId} />
            </CollapsibleSection>

            {/* Includes Section */}
            <CollapsibleSection
              title="Includes"
              isExpanded={sectionsExpanded.includes}
              onToggle={() => toggleSection("includes")}
              showNext={getNextSection("includes") !== null}
              onNext={() => goToNextSection("includes")}
            >
              <HotelIncludesSection
                initialData={initialData}
                onSave={async (data) => {
                  await updateHotelPolicies(
                    Number(hotelId),
                    "include",
                    data.selectedPolicies
                  );
                  return;
                }}
                hotelId={hotelId}
              />
            </CollapsibleSection>

            {/* Excludes Section */}
            <CollapsibleSection
              title="Excludes"
              isExpanded={sectionsExpanded.excludes}
              onToggle={() => toggleSection("excludes")}
              showNext={getNextSection("excludes") !== null}
              onNext={() => goToNextSection("excludes")}
            >
              <HotelExcludesSection
                initialData={initialData}
                onSave={async (data) => {
                  await updateHotelPolicies(
                    Number(hotelId),
                    "exclude",
                    data.selectedPolicies
                  );
                }}
                hotelId={hotelId}
              />
            </CollapsibleSection>

            {/* Amenities Section */}
            <CollapsibleSection
              title="Amenities"
              isExpanded={sectionsExpanded.amenities}
              onToggle={() => toggleSection("amenities")}
              showNext={getNextSection("amenities") !== null}
              onNext={() => goToNextSection("amenities")}
            >
              <HotelAmenitiesSection
                initialData={initialData}
                onSave={async (data) => {
                  console.log("onSave");

                  try {
                    const res = await updateHotelAmenities(
                      Number(hotelId),
                      data.selectedAmenities
                    );
                    console.log("res", res);
                  } catch (error) {
                    console.error("Error updating hotel amenities", error);
                  }
                  return;
                }}
                hotelId={hotelId}
              />
            </CollapsibleSection>

            {/* Safety Features Section */}
            <CollapsibleSection
              title="Safety Features"
              isExpanded={sectionsExpanded.safetyFeatures}
              onToggle={() => toggleSection("safetyFeatures")}
              showNext={getNextSection("safetyFeatures") !== null}
              onNext={() => goToNextSection("safetyFeatures")}
            >
              <HotelSafetyFeaturesSection
                initialData={initialData}
                hotelId={hotelId}
                onSave={async (data) => {
                  await updateHotelSafetyFeatures(
                    Number(hotelId),
                    data.selectedSafetyFeatures
                  );
                  return;
                }}
              />
            </CollapsibleSection>

            {/* FAQs Section */}
            <CollapsibleSection
              title="FAQs"
              isExpanded={sectionsExpanded.faqs}
              onToggle={() => toggleSection("faqs")}
              showNext={false}
            >
              <HotelFaqsSection
                initialData={initialData}
                onSave={async (data) => {
                  await updateHotelFaqs(Number(hotelId), data.selectedFaqs);
                  return;
                }}
                hotelId={hotelId}
              />
            </CollapsibleSection>
          </>
        )}
      </div>
    </div>
  );
}
