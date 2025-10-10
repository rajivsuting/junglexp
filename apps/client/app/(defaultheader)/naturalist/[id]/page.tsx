import { Briefcase, Clock, ImageIcon, MapPin, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getNaturalistById } from "@repo/actions/naturlists.actions";

import { BookNaturalistButton } from "./book-naturalist-button";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NaturalistDetailsPage({ params }: Props) {
  const { id } = await params;
  const naturalist = await getNaturalistById(Number(id));

  if (!naturalist) return notFound();

  const activities =
    naturalist.naturalistActivities?.map((na) => na.activity).filter(Boolean) ||
    [];

  const activitiesCount = activities.length;

  const getDurationTier = (duration: number) => {
    if (duration <= 3) return "Short (≤3 hrs)";
    if (duration <= 6) return "Medium (4-6 hrs)";
    return "Long (6+ hrs)";
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-16 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Naturalist Profile</h1>
          </div>
          {naturalist.park && (
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <MapPin className="w-4 h-4" />
              <p className="text-lg">{naturalist.park.name}</p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Naturalist Profile Card */}
        <Card className="mb-12 pt-0 overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent)]" />
          </div>

          <div className="px-8 pb-8 -mt-16">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Profile Image */}
              <div className="relative h-32 w-32 rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0">
                {naturalist.image ? (
                  <Image
                    src={naturalist.image.small_url}
                    alt={naturalist.image.alt_text || naturalist.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <User className="w-16 h-16 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              {/* Naturalist Info */}
              <div className="flex-1 text-center md:text-left mt-14 md:mt-18">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {naturalist.name}
                </h2>

                {/* Activities Badge */}
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                      activitiesCount === 0
                        ? "bg-gray-100 text-gray-600"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    {activitiesCount === 0 ? (
                      <span>No activities</span>
                    ) : activitiesCount === 1 ? (
                      <span>Specializes in 1 activity</span>
                    ) : (
                      <span>Specializes in {activitiesCount} activities</span>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed max-w-3xl">
                  {naturalist.description}
                </p>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <BookNaturalistButton
                    naturalist={{
                      id: naturalist.id,
                      name: naturalist.name,
                      park: naturalist.park
                        ? {
                            id: naturalist.park.id,
                            name: naturalist.park.name,
                            slug: naturalist.park.slug,
                          }
                        : undefined,
                    }}
                    activities={activities.map((map) => ({
                      id: map?.id!,
                      name: map?.name!,
                    }))}
                  />
                  <Button variant="outline" asChild size="lg">
                    <Link
                      href={`https://wa.me/917428006473?text=Enquiry%20for%20Naturalist%20${encodeURIComponent(
                        naturalist.name
                      )}`}
                      //   href={`/contact?subject=Enquiry%20for%20Naturalist%20${encodeURIComponent(
                      //     naturalist.name
                      //   )}`}
                    >
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Associated Activities Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="w-7 h-7 text-primary" />
            <h2 className="text-3xl font-bold text-primary">
              {activitiesCount === 0
                ? "No Activities"
                : activitiesCount === 1
                  ? "Associated Activity"
                  : "Associated Activities"}
            </h2>
          </div>
          {activitiesCount === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-light text-gray-600 mb-4">
                No activities available
              </h2>
              <p className="text-gray-500">
                We're currently updating our activity options for{" "}
                {naturalist.name}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {(naturalist.naturalistActivities || [])
                .sort((a, b) => {
                  // Sort by duration (longer activities first), then by price
                  const aDuration = a.activity!.packages[0]?.duration || 0;
                  const bDuration = b.activity!.packages[0]?.duration || 0;
                  if (aDuration !== bDuration) {
                    return bDuration - aDuration;
                  }
                  const aPrice = a.activity!.packages[0]?.price_1 || 0;
                  const bPrice = b.activity!.packages[0]?.price_1 || 0;
                  return bPrice - aPrice;
                })
                .map((_activity, index) => {
                  const activity = _activity.activity!;
                  const duration = activity!.packages[0]?.duration || 0;
                  const durationTier = getDurationTier(duration);
                  const hasImage = activity!.images?.[0]?.image?.original_url;

                  return (
                    <Card
                      key={activity.id}
                      className="overflow-hidden pt-0 hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Image Section */}
                      <div className="relative">
                        <div
                          className={cn(
                            "relative h-64 w-full",
                            !hasImage &&
                              "flex items-center justify-center bg-muted"
                          )}
                        >
                          {hasImage ? (
                            <Image
                              src={
                                activity.images[0]?.image?.original_url || ""
                              }
                              alt={
                                activity.images[0]?.image?.alt_text ||
                                activity.name
                              }
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-16 h-16 text-muted-foreground" />
                          )}

                          {/* Duration Tier Badge */}
                          <Badge
                            variant="default"
                            className="absolute top-4 left-4 bg-green-700 hover:bg-green-700/90"
                          >
                            {durationTier}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        {/* Activity Name */}
                        <h3 className="text-lg font-bold text-center mb-2">
                          {activity.name}
                        </h3>

                        {/* Duration and Group Size */}
                        <div className="flex justify-center items-center gap-4 mb-3 text-sm">
                          {activity.packages[0] ? (
                            <>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {activity.packages[0].duration} Hours
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>
                                  {activity.packages[0].number} people
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-muted-foreground">
                              No packages available
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm text-center mb-6 line-clamp-4 whitespace-pre-wrap">
                          {activity.description ||
                            `Experience the thrill of ${activity.name} in ${naturalist.park!.name} with our expert guides.`}
                        </p>

                        {/* Divider */}
                        <Separator className="mb-4" />

                        {/* Pricing */}
                        <div className="text-center mb-4">
                          {activity.packages[0] ? (
                            <>
                              <div className="text-lg font-bold mb-1">
                                From ₹
                                {activity.packages[0].price_1.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Per person
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              Contact for pricing
                            </div>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0 justify-center">
                        <Button variant="link" asChild className="p-0">
                          <Link
                            href={`/parks/${naturalist.park!.slug}/activities/${activity.slug}`}
                            className="inline-flex items-center gap-2"
                          >
                            View Activity
                            <span>&#8594;&#8594;</span>
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          )}
        </div>

        {/* Back to Naturalists */}
        {naturalist.park && (
          <div className="text-center">
            <Button variant="outline" asChild size="lg">
              <Link href={`/parks/${naturalist.park.slug}/naturalists`}>
                <MapPin className="w-4 h-4 mr-2" />
                Back to {naturalist.park.name} Naturalists
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
