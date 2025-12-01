"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  updateActivityAmenities,
  updateActivityPolicies,
} from "@repo/actions/activities.actions";

import { ActivityAmenitiesSection } from "./sections/activity-amenities-section";
import { ActivityDatesSection } from "./sections/activity-dates-section";
import ActivityDetailsSection from "./sections/activity-details-section";
import { ActivityExclusionsSection } from "./sections/activity-exclusions-section";
import { ActivityImagesSection } from "./sections/activity-images-section";
import { ActivityInclusionsSection } from "./sections/activity-inclusions-section";
import ActivityItinerarySection from "./sections/activity-itinerary-section";
import ActivityPackagesSection from "./sections/activity-packages-section";

import type { TActivity } from "@repo/db/index";
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

interface ActivityFormProps {
  pageTitle?: string;
  mode?: "create" | "edit";
  activityId?: number;
  initialData?: TActivity;
}

export default function ActivityForm({
  pageTitle = "Create Activity",
  mode = "create",
  activityId,
  initialData,
}: ActivityFormProps) {
  // Collapsible sections state - only show activity details in create mode
  const [sectionsExpanded, setSectionsExpanded] = useState<{
    activityDetails: boolean;
    images: boolean;
    inclusions: boolean;
    exclusions: boolean;
    itinerary: boolean;
    amenities: boolean;
    dates: boolean;
    packages: boolean;
  }>({
    activityDetails: true,
    images: false,
    inclusions: false,
    exclusions: false,
    itinerary: false,
    amenities: false,
    dates: false,
    packages: false,
  });

  // Define section order for navigation
  const sectionOrder: (keyof typeof sectionsExpanded)[] = [
    "activityDetails",
    "images",
    "inclusions",
    "exclusions",
    "itinerary",
    "amenities",
    "dates",
    "packages",
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

  // Handle amenities save
  const handleAmenitiesSave = async (data: { selectedAmenities: number[] }) => {
    if (!activityId) return;

    try {
      await updateActivityAmenities(activityId, data.selectedAmenities);
    } catch (error) {
      console.error("Error saving activity amenities:", error);
      throw error; // Re-throw to let the component handle the error display
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
        {/* Activity Details Section */}
        <CollapsibleSection
          title="Activity Details"
          isExpanded={sectionsExpanded.activityDetails}
          onToggle={() => toggleSection("activityDetails")}
          showNext={
            mode === "edit" && getNextSection("activityDetails") !== null
          }
          onNext={() => goToNextSection("activityDetails")}
        >
          <ActivityDetailsSection
            onSuccess={
              !!initialData
                ? () => {
                    toggleSection(["activityDetails", "images"]);
                  }
                : undefined
            }
            initialData={initialData}
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
              <ActivityImagesSection
                activityId={activityId!.toString()}
                initialData={initialData}
              />
            </CollapsibleSection>

            {/* Inclusions Section */}
            <CollapsibleSection
              title="Inclusions"
              isExpanded={sectionsExpanded.inclusions}
              onToggle={() => toggleSection("inclusions")}
              showNext={getNextSection("inclusions") !== null}
              onNext={() => goToNextSection("inclusions")}
            >
              <ActivityInclusionsSection
                activityId={activityId!.toString()}
                initialData={initialData}
                onSave={async (data) => {
                  await updateActivityPolicies(
                    Number(activityId!),
                    "include",
                    data.selectedPolicies
                  );
                }}
              />
            </CollapsibleSection>

            {/* Exclusions Section */}
            <CollapsibleSection
              title="Exclusions"
              isExpanded={sectionsExpanded.exclusions}
              onToggle={() => toggleSection("exclusions")}
              showNext={getNextSection("exclusions") !== null}
              onNext={() => goToNextSection("exclusions")}
            >
              <ActivityExclusionsSection
                activityId={activityId!.toString()}
                initialData={initialData}
                onSave={async (data) => {
                  await updateActivityPolicies(
                    Number(activityId!),
                    "exclude",
                    data.selectedPolicies
                  );
                }}
              />
            </CollapsibleSection>

            {/* Itinerary Section */}
            <CollapsibleSection
              title="Itinerary"
              isExpanded={sectionsExpanded.itinerary}
              onToggle={() => toggleSection("itinerary")}
              showNext={getNextSection("itinerary") !== null}
              onNext={() => goToNextSection("itinerary")}
            >
              <ActivityItinerarySection
                initialData={initialData}
                activityId={activityId!}
              />
            </CollapsibleSection>

            {/* Amenities Section */}
            {/* <CollapsibleSection
              title="Amenities"
              isExpanded={sectionsExpanded.amenities}
              onToggle={() => toggleSection("amenities")}
              showNext={getNextSection("amenities") !== null}
              onNext={() => goToNextSection("amenities")}
            >
              <ActivityAmenitiesSection
                activityId={activityId}
                // @ts-ignore
                onSave={handleAmenitiesSave}
                initialData={initialData}
              />
            </CollapsibleSection> */}

            {/* Dates Section */}
            <CollapsibleSection
              title="Available Dates"
              isExpanded={sectionsExpanded.dates}
              onToggle={() => toggleSection("dates")}
              showNext={getNextSection("dates") !== null}
              onNext={() => goToNextSection("dates")}
            >
              <ActivityDatesSection activityId={activityId!} />
            </CollapsibleSection>

            {/* Packages Section */}
            <CollapsibleSection
              title="Packages"
              isExpanded={sectionsExpanded.packages}
              onToggle={() => toggleSection("packages")}
            >
              <ActivityPackagesSection
                activityId={activityId!}
                initialData={initialData}
              />
            </CollapsibleSection>
          </>
        )}
      </div>
    </div>
  );
}
