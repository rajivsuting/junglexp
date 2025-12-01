import { Clock, Image as ImageIcon, Star, Users } from "lucide-react";
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
import { getActivitiesByParkSlug } from "@repo/actions/activities.actions";
import { getNationalParkBySlug } from "@repo/actions/parks.actions";

// Force dynamic rendering to avoid build-time database calls
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type PageProps = {
  params: Promise<{ "park-id": string }>;
};

export const generateMetadata = async ({ params }: PageProps) => {
  const park = await getNationalParkBySlug(params["park-id"]);
  if (!park) return notFound();
  return {
    title: `${park.name} Activities`,
    description: `${park.name} offers a diverse range of activities from exciting safaris to cultural experiences and adventure activities.`,
    openGraph: {
      title: `${park.name} Activities`,
      description: `${park.name} offers a diverse range of activities from exciting safaris to cultural experiences and adventure activities.`,
      images: park.images.map((image) => image.image?.small_url),
    },
  };
};

// Duration tier mapping based on activity duration
const getDurationTier = (duration: number) => {
  if (duration >= 8) return "Full Day";
  if (duration >= 4) return "Half Day";
  return "Short";
};

// Get activity category based on duration
const getActivityCategory = (duration: number) => {
  if (duration >= 24) return "Multi-Day";
  if (duration >= 8) return "Full Day";
  if (duration >= 4) return "Half Day";
  return "Short Experience";
};

export default async function SafarisAndActivitiesPage(props: PageProps) {
  const params = await props.params;

  const park = await getNationalParkBySlug(params["park-id"]);

  if (!park) {
    return notFound();
  }

  // Get all activities for this park
  const allActivities = await getActivitiesByParkSlug({
    park_slug: params["park-id"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          {/* Best Price Guarantee Banner */}
          <div className="inline-block bg-white text-primary px-6 py-2 rounded-full text-sm font-bold mb-8">
            ★ BEST PRICE GUARANTEE ★
          </div>

          <h1 className="text-5xl md:text-6xl font-light mb-4">
            {park.name.toUpperCase()} ACTIVITIES
          </h1>

          <p className="text-xl mb-2 opacity-90">Specialists in {park.name}</p>

          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>

          <p className="text-lg max-w-4xl mx-auto mb-4">
            {park.name} offers a diverse range of activities from exciting
            safaris to cultural experiences and adventure activities.
          </p>

          <p className="text-lg">
            Below is a comprehensive list of activities organized by duration.
          </p>

          <p className="text-lg font-semibold mt-4">
            Please enquire for availability and specials.
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      {/* <div className='bg-background border-b shadow-sm'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex flex-wrap justify-center gap-4'>
            <Button variant='outline' asChild>
              <Link href={`/parks/${park.slug}/activities?duration=short`}>
                Short Experiences ({allActivities.activities.filter(a => a.packages[0] && a.packages[0].duration < 4).length}
                )
              </Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href={`/parks/${park.slug}/activities?duration=half`}>
                Half Day (
                {
                  allActivities.activities.filter(
                    a => a.packages[0] && a.packages[0].duration >= 4 && a.packages[0].duration < 8
                  ).length
                }
                )
              </Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href={`/parks/${park.slug}/activities?duration=full`}>
                Full Day (
                {
                  allActivities.activities.filter(
                    a => a.packages[0] && a.packages[0].duration >= 8 && a.packages[0].duration < 24
                  ).length
                }
                )
              </Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href={`/parks/${park.slug}/activities?duration=multi`}>
                Multi-Day ({allActivities.activities.filter(a => a.packages[0] && a.packages[0].duration >= 24).length})
              </Link>
            </Button>
          </div>
        </div>
      </div> */}

      {/* Activities Grid */}
      <div className="container mx-auto px-4 py-16">
        {allActivities.activities.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-light text-gray-600 mb-4">
              No activities available
            </h2>
            <p className="text-gray-500">
              We're currently updating our activity options for {park.name}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {allActivities.activities
              .sort((a, b) => {
                // Sort by duration (longer activities first), then by price
                const aDuration = a.packages[0]?.duration || 0;
                const bDuration = b.packages[0]?.duration || 0;
                if (aDuration !== bDuration) {
                  return bDuration - aDuration;
                }
                const aPrice = a.packages[0]?.price_1 || 0;
                const bPrice = b.packages[0]?.price_1 || 0;
                return bPrice - aPrice;
              })
              .map((activity, index) => {
                const duration = activity.packages[0]?.duration || 0;
                const durationTier = getDurationTier(duration);
                const hasImage = activity.images?.[0]?.image?.original_url;

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
                            src={activity.images[0]?.image?.original_url || ""}
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
                              <span>{activity.packages[0].duration} Hours</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{activity.packages[0].number} people</span>
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
                          `Experience the thrill of ${activity.name} in ${park.name} with our expert guides.`}
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
                          href={`/parks/${params["park-id"]}/activities/${activity.slug}`}
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

        {/* Contact Section */}
        <Card className="mt-16 max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-bold text-primary">
              {park.name.toUpperCase()} ADVENTURES
            </h2>
            <p className="text-lg text-muted-foreground">
              Specialists in {park.name}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              {/* <Button size="lg">Start Planning</Button> */}
              <Link
                href={`https://wa.me/917428006473?text=Enquiry%20for%20Activities%20in%20${encodeURIComponent(
                  park.name
                )}`}
              >
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span>★★★★★ Google Reviews</span>
              <span>•</span>
              <span>Useful Info</span>
              <span>•</span>
              <span>Specials</span>
              <span>•</span>
              <span>Terms & Conditions</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
