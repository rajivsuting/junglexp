import { Image as ImageIcon, Star } from "lucide-react";
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
import { getHotelsByParkId } from "@repo/actions/hotels.actions";
import { getNationalParkBySlug } from "@repo/actions/parks.actions";

import type { TRoomBase, TRoomPlan } from "@repo/db/index";

type PageProps = {
  params: Promise<{ "park-id": string }>;
  searchParams: Promise<{ "stay-type": string }>;
};

// Price tier mapping based on hotel rating
const getPriceTier = (rating: number) => {
  if (rating >= 4) return "$$$";
  if (rating >= 3) return "$$";
  return "$";
};

// Get price range based on hotel type and rating
const getPriceRange = (rooms: TRoomBase & { plans: TRoomPlan[] }[]) => {
  if (rooms.length === 0) return { min: 0, max: 0 };

  const min = Math.min(
    ...rooms.map((r) => {
      if (r.plans.length === 0) return 0;
      return Math.min(...r.plans.map((p) => p.price || 0)) || 0;
    })
  );
  const max = Math.max(
    ...rooms.map((r) => {
      if (r.plans.length === 0) return 0;
      return Math.max(...r.plans.map((p) => p.price || 0)) || 0;
    })
  );

  return { min: min === 0 ? (max == 0 ? 0 : max) : min, max: max };
};

export const dynamicParams = true;
export const dynamic = "force-static";
export const revalidate = 86400;

export const generateMetadata = async (props: PageProps) => {
  const params = await props.params;
  const park = await getNationalParkBySlug(params["park-id"]);
  if (!park) return notFound();

  return {
    title: `${park.name} Stays`,
    description: `${park.name} offers a full range of accommodation options from simple camps to some of the most sought after luxury lodges in the region.`,
    openGraph: {
      title: `${park.name} Stays`,
      description: `${park.name} offers a full range of accommodation options from simple camps to some of the most sought after luxury lodges in the region.`,
      images: park.images.map((image) => image.image?.small_url),
    },
  };
};

export default async function AllStaysPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  console.log("params", params["park-id"], params, searchParams);

  const park = await getNationalParkBySlug(params["park-id"]);

  if (!park) {
    return notFound();
  }

  let stayType = searchParams["stay-type"] || undefined;

  if (!!stayType && !["resort", "forest", "home"].includes(stayType)) {
    stayType = undefined;
  }

  // Get all hotels for this park
  const allHotels = await getHotelsByParkId(park.id);

  // Get first image for hero (desktop and mobile)
  const heroImage = park?.images?.[0]?.image;
  const mobileHeroImage = park?.mobile_images?.[0]?.image || heroImage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[60dvh] flex items-center justify-start overflow-hidden">
        {/* Desktop Image */}
        {heroImage && (
          <div className="hidden md:block absolute inset-0">
            <Image
              src={heroImage.original_url}
              alt={heroImage.alt_text || `${park.name} Stays`}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        )}
        {/* Mobile Image */}
        {mobileHeroImage && (
          <div className="block md:hidden absolute inset-0">
            <Image
              src={mobileHeroImage.original_url}
              alt={mobileHeroImage.alt_text || `${park.name} Stays`}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        )}
        <div className="absolute inset-0 z-0 bg-black/30"></div>
        <div className="relative grid grid-cols-1 z-10 mx-4 sm:mx-6 lg:mx-24 text-center">
          {/* Best Price Guarantee Banner */}
          <div className="inline-flex w-fit mx-auto bg-white text-primary px-6 py-2 rounded-full text-sm font-bold mb-8">
            ★ BEST PRICE GUARANTEE ★
          </div>

          <h1 className="text-[32px] md:text-[62px] font-light mb-4 text-white drop-shadow">
            {park.name.toUpperCase()} LODGES
          </h1>

          <p className="text-xl mb-2 opacity-90 text-white">
            Specialists in {park.name}
          </p>

          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
        </div>
      </section>

      {/* Quick Navigation */}
      <div className="bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href={`/parks/${park.slug}/stays?stay-type=resort`}>
                Resorts (
                {allHotels.filter((h) => h.hotel_type === "resort").length})
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/parks/${park.slug}/stays?stay-type=forest`}>
                Forest Stays (
                {allHotels.filter((h) => h.hotel_type === "forest").length})
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/parks/${park.slug}/stays?stay-type=home`}>
                Home Stays (
                {allHotels.filter((h) => h.hotel_type === "home").length})
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="container mx-auto px-4 py-16">
        {allHotels.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-light text-gray-600 mb-4">
              No accommodations available
            </h2>
            <p className="text-gray-500">
              We're currently updating our accommodation options for {park.name}
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {allHotels
              .filter((h) => (!stayType ? true : h.hotel_type === stayType))
              .sort((a, b) => {
                // Sort by price tier first ($$$ > $$ > $), then by rating
                const aTier = getPriceTier(a.rating || 0);
                const bTier = getPriceTier(b.rating || 0);
                if (aTier !== bTier) {
                  return bTier.length - aTier.length; // More $ symbols = higher tier
                }
                return (b.rating || 0) - (a.rating || 0);
              })
              .map((hotel, index) => {
                const priceTier = getPriceTier(hotel.rating || 0);
                const priceRange = getPriceRange(hotel.rooms as any);
                const hasImage = hotel.images?.[0]?.image?.original_url;

                return (
                  <Card
                    key={hotel.id}
                    className="overflow-hidden hover:shadow-lg pt-0 transition-shadow duration-300"
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
                            src={hotel.images[0]?.image?.original_url || ""}
                            alt={hotel.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-16 h-16 text-muted-foreground" />
                        )}

                        {hotel.is_featured && (
                          <Badge
                            variant="default"
                            className="absolute top-4 left-4 bg-green-700 hover:bg-green-700/90"
                          >
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Hotel Name */}
                      <h3 className="text-lg font-bold text-center mb-2">
                        {hotel.name}
                      </h3>

                      {/* Star Rating */}
                      <div className="flex justify-center mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "w-4 h-4",
                                star <= (hotel.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted"
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm text-center mb-6 line-clamp-4">
                        {hotel.description ||
                          `Experience luxury and comfort at ${hotel.name}, perfectly situated in ${park.name} for an unforgettable stay.`}
                      </p>

                      {/* Divider */}
                      <Separator className="mb-4" />

                      {/* Pricing */}
                      <div className="text-center mb-4">
                        <div className="text-lg font-bold mb-1">
                          From ₹{priceRange.min.toLocaleString()}{" "}
                          {priceRange.min === priceRange.max
                            ? ""
                            : `to ₹${priceRange.max.toLocaleString()}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Per room per night
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0 justify-center">
                      <Button variant="link" asChild className="p-0">
                        <Link
                          href={`/stays/${hotel.slug || hotel.id}`}
                          className="inline-flex items-center gap-2"
                        >
                          View Property
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
              {park.name.toUpperCase()} SAFARIS
            </h2>
            <p className="text-lg text-muted-foreground">
              Specialists in {park.name}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              {/* <Button size="lg">Start Planning</Button> */}
              <Link
                href={`https://wa.me/917428006473?text=Enquiry%20for%20Stays%20in%20${encodeURIComponent(
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
