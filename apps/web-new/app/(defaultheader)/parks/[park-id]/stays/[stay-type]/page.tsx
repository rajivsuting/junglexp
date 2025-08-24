import { Image as ImageIcon, MapPin, Star, Users } from "lucide-react";
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
import {
	getHotelsByParkId,
	getHotelsByParkSlug,
} from "@repo/actions/hotels.actions";
import { getNationalParkBySlug } from "@repo/actions/parks.actions";
import { hotelTypeEnum } from "@repo/db/schema/hotels";

import type { THotelType } from "@repo/db/schema/hotels";

type PageProps = {
	params: Promise<{ "park-id": string; "stay-type": string }>;
};

// Price tier mapping based on hotel rating
const getPriceTier = (rating: number) => {
	if (rating >= 4) return "$$$";
	if (rating >= 3) return "$$";
	return "$";
};

// Get price range based on hotel type and rating
const getPriceRange = (hotelType: string, rating: number) => {
	const basePrice =
		hotelType === "resort" ? 400 : hotelType === "forest" ? 300 : 200;
	const multiplier = rating / 5;
	const min = Math.round(basePrice * multiplier);
	const max = Math.round(min * 2);
	return { min, max };
};

// Capitalize hotel type for display
const formatStayType = (stayType: string) => {
	switch (stayType) {
		case "resort":
			return "Resorts";
		case "forest":
			return "Forest Stays";
		case "home":
			return "Home Stays";
		default:
			return "Stays";
	}
};

export default async function StaysPage(props: PageProps) {
	const params = await props.params;

	const park = await getNationalParkBySlug(params["park-id"]);

	if (!park) {
		return notFound();
	}

	if (!hotelTypeEnum.enumValues.includes(params["stay-type"] as THotelType)) {
		return notFound();
	}

	const hotels = await getHotelsByParkId(
		park?.id,
		params["stay-type"] as THotelType,
	);

	const stayTypeFormatted = formatStayType(params["stay-type"]);

	return (
		<div className="min-h-screen">
			{/* Header Section */}
			<div className="text-primary py-16">
				<div className="container mx-auto px-4">
					<h1 className="text-2xl md:text-3xl font-light text-center mb-4">
						{stayTypeFormatted.toUpperCase()} IN{" "}
						<span className="font-bold">{park.name.toUpperCase()}</span>
					</h1>
					<p className="text-md text-center max-w-4xl mx-auto opacity-90">
						{park.name} offers a full range of accommodation options from simple
						camps to some of the most sought after luxury{" "}
						{stayTypeFormatted.toLowerCase()} in the region.
					</p>
					<p className="text-center mt-4 text-md">
						Below is a comprehensive list of accommodation in order of rating.
					</p>
					<p className="text-center text-md mt-2 font-semibold">
						Please enquire for availability and specials.
					</p>
				</div>
			</div>

			{/* Hotels Grid */}
			<div className="container mx-auto px-4 py-16">
				{hotels.length === 0 ? (
					<div className="text-center py-16">
						<h2 className="text-2xl font-light text-gray-600 mb-4">
							No {stayTypeFormatted.toLowerCase()} available
						</h2>
						<p className="text-gray-500">
							We're currently updating our accommodation options for {park.name}
							.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{hotels
							.sort((a, b) => (b.rating || 0) - (a.rating || 0)) // Sort by rating desc
							.map((hotel, index) => {
								const priceTier = getPriceTier(hotel.rating || 0);
								const priceRange = getPriceRange(
									params["stay-type"],
									hotel.rating || 0,
								);
								const hasImage = hotel.images?.[0]?.image?.original_url;

								return (
									<Card
										key={hotel.id}
										className="overflow-hidden bg-white hover:shadow-lg pt-0 transition-shadow duration-300"
									>
										{/* Image Section */}
										<div className="relative">
											<div
												className={cn(
													"relative h-64 w-full",
													!hasImage &&
														"flex items-center justify-center bg-muted",
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

												{/* Price Tier Badge */}
												<Badge
													variant="default"
													className="absolute top-4 left-4 bg-green-700 hover:bg-green-700/90"
												>
													{priceTier}
												</Badge>
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
																	: "text-accent",
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
													From ${priceRange.min} to ${priceRange.max}
												</div>
												<div className="text-xs text-muted-foreground">
													Per person per night
												</div>
											</div>
										</CardContent>

										<CardFooter className="pt-0 justify-center">
											<Button variant="link" asChild className="p-0">
												<Link
													href={`/parks/${park.slug}/hotels/${hotel.slug || hotel.id}`}
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
							Need Help Planning Your Stay?
						</h2>
						<p className="text-muted-foreground">
							Our specialists in {park.name} are here to help you find the
							perfect accommodation for your safari adventure.
						</p>
					</CardHeader>
					<CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg">Contact Our Specialists</Button>
						<Button variant="outline" size="lg">
							Request Quote
						</Button>
					</CardFooter>
				</Card>

				{/* Navigation Links */}
				<div className="mt-12 text-center">
					<div className="flex flex-wrap justify-center gap-4">
						<Button
							variant={params["stay-type"] === "resort" ? "default" : "outline"}
							asChild
						>
							<Link href={`/parks/${park.slug}/stays/resort`}>Resorts</Link>
						</Button>
						<Button
							variant={params["stay-type"] === "forest" ? "default" : "outline"}
							asChild
						>
							<Link href={`/parks/${park.slug}/stays/forest`}>
								Forest Stays
							</Link>
						</Button>
						<Button
							variant={params["stay-type"] === "home" ? "default" : "outline"}
							asChild
						>
							<Link href={`/parks/${park.slug}/stays/home`}>Home Stays</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
