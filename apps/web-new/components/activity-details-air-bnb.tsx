"use client";

import {
	Award,
	Calendar,
	Car,
	Check,
	ChevronDown,
	ChevronRight,
	Clock,
	Heart,
	MapPin,
	Share,
	Shield,
	Snowflake,
	Star,
	Tv,
	Users,
	UtensilsCrossed,
	Waves,
	Wifi,
	X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { FAQSection } from "@/components/faq-section";

import ReviewsSection from "./ReviewsSection";

interface ActivityDetailsProps {
	title: string;
	location: string;
	rating: number;
	reviews: number;
	price: number;
	originalPrice?: number;
	description: string;
	images: string[];
	amenities: string[];
	included: string[];
	excluded: string[];
	safetyFeatures: string[];
	host: {
		name: string;
		image: string;
		joinedDate: string;
		isSuperhost: boolean;
		languages: string[];
		responseRate: number;
	};
	cancellationPolicy: string;
	houseRules: string[];
}

const defaultProps: ActivityDetailsProps = {
	title: "Luxurious Beachfront Villa with Private Pool",
	location: "Candolim, Goa, India",
	rating: 4.93,
	reviews: 187,
	price: 18500,
	originalPrice: 22000,
	description:
		"Escape to this stunning beachfront villa featuring panoramic ocean views, a private infinity pool, and direct beach access. This meticulously designed property offers the perfect blend of luxury and comfort, ideal for families, couples, or groups seeking an unforgettable Goa experience.\n\nThe villa spans three levels with spacious bedrooms, each offering breathtaking sea views. The open-plan living area flows seamlessly to the outdoor terrace, perfect for sunset cocktails and al fresco dining.",
	images: [
		"https://a0.muscache.com/im/pictures/prohost-api/Hosting-985423829266413320/original/6ddc9177-a29f-4164-bc05-398ba917a049.jpeg?im_w=1200",
		"https://a0.muscache.com/im/pictures/prohost-api/Hosting-985423829266413320/original/bec93e38-fd7d-43d1-b62a-a93276f6754c.jpeg?im_w=720",
		"https://a0.muscache.com/im/pictures/prohost-api/Hosting-985423829266413320/original/dcc3537f-4cd6-4fe7-adef-12530de74dbe.jpeg?im_w=720",
		"https://a0.muscache.com/im/pictures/prohost-api/Hosting-985423829266413320/original/dcc3537f-4cd6-4fe7-adef-12530de74dbe.jpeg?im_w=720",
		"https://a0.muscache.com/im/pictures/prohost-api/Hosting-985423829266413320/original/dcc3537f-4cd6-4fe7-adef-12530de74dbe.jpeg?im_w=720",
	],
	amenities: [
		"Ocean View",
		"Private Pool",
		"WiFi",
		"Full Kitchen",
		"Air Conditioning",
		"Free Parking",
		"Beach Access",
		"Smart TV",
		"Washer & Dryer",
		"Balcony",
		"Hair Dryer",
		"Iron",
	],
	included: [
		"Daily housekeeping",
		"Pool maintenance",
		"Beach towels",
		"Welcome drinks on arrival",
		"Complimentary WiFi",
		"Parking space",
		"Kitchen essentials (oil, salt, spices)",
		"Coffee and tea",
		"Fresh linens and towels",
		"24/7 property manager support",
	],
	excluded: [
		"Airport transfers",
		"Meals (breakfast, lunch, dinner)",
		"Alcoholic beverages",
		"Laundry service",
		"Spa treatments",
		"Tour bookings",
		"Grocery shopping",
		"Additional cleaning services",
		"Late check-out fees",
		"Damage deposit (held separately)",
	],
	safetyFeatures: [
		"Smoke detector",
		"Carbon monoxide detector",
		"Fire extinguisher",
		"First aid kit",
		"Security cameras (exterior only)",
		"Secure entry",
		"Pool safety equipment",
	],
	host: {
		name: "Rajesh Kumar",
		image:
			"https://a0.muscache.com/im/pictures/user/original/host-placeholder.jpg",
		joinedDate: "March 2019",
		isSuperhost: true,
		languages: ["English", "Hindi", "Konkani"],
		responseRate: 98,
	},
	cancellationPolicy: "Free cancellation before 48 hours",
	houseRules: [
		"Check-in: 3:00 PM - 9:00 PM",
		"Check-out: 11:00 AM",
		"Maximum 8 guests",
		"No smoking",
		"No pets",
		"No parties or events",
		"Quiet hours: 10 PM - 8 AM",
	],
};

const getAmenityIcon = (amenity: string) => {
	const iconMap: { [key: string]: any } = {
		WiFi: <Wifi className="w-6 h-6" />,
		"Free Parking": <Car className="w-6 h-6" />,
		"Air Conditioning": <Snowflake className="w-6 h-6" />,
		"Full Kitchen": <UtensilsCrossed className="w-6 h-6" />,
		"Smart TV": <Tv className="w-6 h-6" />,
		"Private Pool": <Waves className="w-6 h-6" />,
	};
	return iconMap[amenity] || <Check className="w-6 h-6" />;
};

export default function ActivityDetailsAirBnb(
	props: Partial<ActivityDetailsProps>,
) {
	const {
		title,
		location,
		rating,
		reviews,
		price,
		originalPrice,
		description,
		images,
		amenities,
		included,
		excluded,
		safetyFeatures,
		host,
		cancellationPolicy,
		houseRules,
	} = { ...defaultProps, ...props };

	const [selectedImage, setSelectedImage] = useState(0);
	const [showAllPhotos, setShowAllPhotos] = useState(false);
	const [showAllAmenities, setShowAllAmenities] = useState(false);
	const [showIncluded, setShowIncluded] = useState(false);
	const [showExcluded, setShowExcluded] = useState(false);
	const [showBookingModal, setShowBookingModal] = useState(false);

	const displayedAmenities = showAllAmenities
		? amenities
		: amenities.slice(0, 6);

	// Booking Form Component
	const BookingForm = ({ className = "" }: { className?: string }) => (
		<div className={className}>
			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-0 border border-border overflow-hidden">
					<div className="p-3 border-r border-border">
						<label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Check-in
						</label>
						<input
							type="date"
							className="w-full mt-1 bg-transparent text-primary focus:outline-none text-sm"
							defaultValue="2025-08-29"
						/>
					</div>
					<div className="p-3">
						<label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Check-out
						</label>
						<input
							type="date"
							className="w-full mt-1 bg-transparent text-primary focus:outline-none text-sm"
							defaultValue="2025-08-31"
						/>
					</div>
				</div>
				<div className="border border-border p-3">
					<label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Guests
					</label>
					<select className="w-full mt-1 bg-transparent text-primary focus:outline-none text-sm">
						<option>1 guest</option>
						<option>2 guests</option>
						<option>3 guests</option>
						<option>4 guests</option>
						<option>5 guests</option>
						<option>6 guests</option>
						<option>7 guests</option>
						<option>8 guests</option>
					</select>
				</div>
				<button className="w-full bg-accent text-accent-foreground py-3 font-medium hover:bg-accent/90 transition-colors text-lg">
					Reserve
				</button>
				<p className="text-center text-sm text-muted-foreground">
					You won't be charged yet
				</p>
			</div>

			{/* Price Breakdown */}
			<div className="mt-6 space-y-3">
				<div className="flex items-center justify-between text-primary">
					<span className="underline">
						₹{price.toLocaleString()} × 2 nights
					</span>
					<span>₹{(price * 2).toLocaleString()}</span>
				</div>
				<div className="flex items-center justify-between text-primary">
					<span className="underline">Cleaning fee</span>
					<span>₹2,500</span>
				</div>
				<div className="flex items-center justify-between text-primary">
					<span className="underline">Service fee</span>
					<span>₹3,200</span>
				</div>
				<div className="flex items-center justify-between text-primary">
					<span className="underline">Taxes</span>
					<span>₹1,840</span>
				</div>
				<div className="pt-4 border-t border-border flex items-center justify-between font-semibold text-primary text-lg">
					<span>Total</span>
					<span>₹{(price * 2 + 2500 + 3200 + 1840).toLocaleString()}</span>
				</div>
			</div>

			{/* Cancellation Policy */}
			<div className="mt-6 pt-6 border-t border-border">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Calendar className="w-4 h-4" />
					<span>{cancellationPolicy}</span>
				</div>
			</div>
		</div>
	);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
				<span>Homes</span>
				<ChevronRight className="w-4 h-4" />
				<span>India</span>
				<ChevronRight className="w-4 h-4" />
				<span>Goa</span>
				<ChevronRight className="w-4 h-4" />
				<span className="text-primary">Candolim</span>
			</div>

			{/* Title Section */}
			<div className="mb-6">
				<h1 className="text-3xl font-semibold text-primary mb-2">{title}</h1>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Star className="w-5 h-5 text-accent fill-current" />
						<span className="font-medium">{rating}</span>
						<span className="text-muted-foreground">({reviews} reviews)</span>
						<span className="mx-2">•</span>
						<MapPin className="w-4 h-4 text-muted-foreground" />
						<span className="text-primary underline cursor-pointer">
							{location}
						</span>
					</div>
					<div className="flex items-center gap-4">
						<button className="flex items-center gap-2 hover:text-accent transition-colors">
							<Share className="w-5 h-5" />
							<span className="underline">Share</span>
						</button>
						<button className="flex items-center gap-2 hover:text-accent transition-colors">
							<Heart className="w-5 h-5" />
							<span className="underline">Save</span>
						</button>
					</div>
				</div>
			</div>

			{/* Image Gallery */}
			<div className="relative mb-8">
				<div className="grid grid-cols-4 gap-2 aspect-[12/5] overflow-hidden">
					<div className="col-span-2 row-span-2 relative">
						<Image
							unoptimized
							src={images[0] || "/placeholder.jpg"}
							alt={`${title} main image`}
							fill
							className="object-cover hover:brightness-90 transition-all cursor-pointer"
							onClick={() => setShowAllPhotos(true)}
						/>
					</div>
					{images.slice(1, 5).map((image, index) => (
						<div key={index} className="relative">
							<Image
								unoptimized
								src={image || "/placeholder.jpg"}
								alt={`${title} image ${index + 2}`}
								fill
								className="object-cover hover:brightness-90 transition-all cursor-pointer"
								onClick={() => setShowAllPhotos(true)}
							/>
						</div>
					))}
					<button
						onClick={() => setShowAllPhotos(true)}
						className="absolute bottom-4 right-4 bg-white px-4 py-2 font-medium text-sm hover:bg-gray-100 transition-colors border border-gray-300"
					>
						Show all photos
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
				{/* Main Content */}
				<div className="lg:col-span-2">
					{/* Host Info */}
					<div className="flex items-center justify-between pb-6 border-b border-border">
						<div>
							<h2 className="text-xl font-semibold text-primary mb-2">
								Entire villa hosted by {host.name}
							</h2>
							<div className="flex items-center gap-4 text-muted-foreground text-sm">
								<span>8 guests</span>
								<span>•</span>
								<span>4 bedrooms</span>
								<span>•</span>
								<span>4 beds</span>
								<span>•</span>
								<span>3 baths</span>
							</div>
						</div>
						<div className="relative">
							<Image
								src={host.image || "/host-placeholder.jpg"}
								alt={host.name}
								width={56}
								height={56}
								className="rounded-full"
							/>
							{host.isSuperhost && (
								<div className="absolute -bottom-1 -right-1 bg-accent rounded-full p-1">
									<Award className="w-4 h-4 text-accent-foreground" />
								</div>
							)}
						</div>
					</div>

					{/* Host Details */}
					<div className="py-6 border-b border-border">
						<div className="flex items-center gap-3 mb-4">
							{host.isSuperhost && (
								<div className="flex items-center gap-2">
									<Award className="w-5 h-5 text-accent" />
									<span className="font-medium">Superhost</span>
								</div>
							)}
							<div className="flex items-center gap-2">
								<Users className="w-5 h-5 text-muted-foreground" />
								<span>{host.responseRate}% response rate</span>
							</div>
						</div>
						<p className="text-muted-foreground">
							Languages: {host.languages.join(", ")} • Joined {host.joinedDate}
						</p>
					</div>

					{/* Description */}
					<div className="py-6 border-b border-border">
						<p className="text-primary whitespace-pre-line leading-relaxed">
							{description}
						</p>
					</div>

					{/* What's Included Section */}
					<div className="py-6 border-b border-border">
						<button
							onClick={() => setShowIncluded(!showIncluded)}
							className="flex items-center justify-between w-full text-left"
						>
							<h2 className="text-xl font-semibold text-primary">
								What's included
							</h2>
							<ChevronDown
								className={`w-5 h-5 transition-transform ${
									showIncluded ? "rotate-180" : ""
								}`}
							/>
						</button>
						{showIncluded && (
							<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
								{included.map((item, index) => (
									<div
										key={index}
										className="flex items-center gap-3 text-primary"
									>
										<Check className="w-5 h-5 text-green-600 flex-shrink-0" />
										<span>{item}</span>
									</div>
								))}
							</div>
						)}
					</div>

					{/* What's Not Included Section */}
					<div className="py-6 border-b border-border">
						<button
							onClick={() => setShowExcluded(!showExcluded)}
							className="flex items-center justify-between w-full text-left"
						>
							<h2 className="text-xl font-semibold text-primary">
								What's not included
							</h2>
							<ChevronDown
								className={`w-5 h-5 transition-transform ${
									showExcluded ? "rotate-180" : ""
								}`}
							/>
						</button>
						{showExcluded && (
							<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
								{excluded.map((item, index) => (
									<div
										key={index}
										className="flex items-center gap-3 text-primary"
									>
										<X className="w-5 h-5 text-red-500 flex-shrink-0" />
										<span>{item}</span>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Amenities */}
					<div className="py-6 border-b border-border">
						<h2 className="text-xl font-semibold text-primary mb-4">
							What this place offers
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{displayedAmenities.map((amenity) => (
								<div
									key={amenity}
									className="flex items-center gap-3 text-primary py-2"
								>
									<div className="text-muted-foreground">
										{getAmenityIcon(amenity)}
									</div>
									{amenity}
								</div>
							))}
						</div>
						{amenities.length > 6 && (
							<button
								onClick={() => setShowAllAmenities(!showAllAmenities)}
								className="mt-4 border border-border px-6 py-2 hover:bg-muted transition-colors"
							>
								{showAllAmenities
									? "Show less"
									: `Show all ${amenities.length} amenities`}
							</button>
						)}
					</div>

					{/* Safety Features */}
					<div className="py-6 border-b border-border">
						<h2 className="text-xl font-semibold text-primary mb-4">
							Safety features
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{safetyFeatures.map((feature) => (
								<div
									key={feature}
									className="flex items-center gap-3 text-primary py-2"
								>
									<Shield className="w-6 h-6 text-muted-foreground" />
									{feature}
								</div>
							))}
						</div>
					</div>

					{/* House Rules */}
					<div className="py-6 border-b border-border">
						<h2 className="text-xl font-semibold text-primary mb-4">
							House rules
						</h2>
						<div className="space-y-3">
							{houseRules.map((rule, index) => (
								<div
									key={index}
									className="flex items-center gap-3 text-primary"
								>
									<Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
									<span>{rule}</span>
								</div>
							))}
						</div>
					</div>

					<FAQSection />
				</div>
				{/* Booking Card - Desktop Only */}
				<div className="lg:col-span-1 hidden lg:block">
					<div className="sticky top-24 border border-border p-6 shadow-lg bg-card">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-baseline gap-2">
								<span className="text-2xl font-semibold text-primary">
									₹{price.toLocaleString()}
								</span>
								{originalPrice && (
									<span className="text-lg text-muted-foreground line-through">
										₹{originalPrice.toLocaleString()}
									</span>
								)}
								<span className="text-muted-foreground">/night</span>
							</div>
							<div className="flex items-center gap-1">
								<Star className="w-4 h-4 text-accent fill-current" />
								<span className="font-medium">{rating}</span>
								<span className="text-muted-foreground">({reviews})</span>
							</div>
						</div>

						<BookingForm />
					</div>
				</div>
			</div>

			{/* Mobile/Tablet Fixed Bottom Button */}
			<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 z-40">
				<div className="flex items-center justify-between max-w-7xl mx-auto">
					<div className="flex items-center gap-2">
						<div className="flex items-baseline gap-2">
							<span className="text-xl font-semibold text-primary">
								₹{price.toLocaleString()}
							</span>
							{originalPrice && (
								<span className="text-sm text-muted-foreground line-through">
									₹{originalPrice.toLocaleString()}
								</span>
							)}
							<span className="text-sm text-muted-foreground">/night</span>
						</div>
						<div className="flex items-center gap-1">
							<Star className="w-4 h-4 text-accent fill-current" />
							<span className="text-sm font-medium">{rating}</span>
						</div>
					</div>
					<button
						onClick={() => setShowBookingModal(true)}
						className="bg-accent text-accent-foreground px-6 py-3 font-medium hover:bg-accent/90 transition-colors rounded-lg"
					>
						Reserve Now
					</button>
				</div>
			</div>

			{/* Booking Modal - Mobile/Tablet */}
			{showBookingModal && (
				<div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
					<div className="bg-white w-full max-h-[90vh] overflow-y-auto rounded-t-xl">
						<div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
							<h2 className="text-lg font-semibold text-primary">Reserve</h2>
							<button
								onClick={() => setShowBookingModal(false)}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X className="w-6 h-6" />
							</button>
						</div>
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-baseline gap-2">
									<span className="text-2xl font-semibold text-primary">
										₹{price.toLocaleString()}
									</span>
									{originalPrice && (
										<span className="text-lg text-muted-foreground line-through">
											₹{originalPrice.toLocaleString()}
										</span>
									)}
									<span className="text-muted-foreground">/night</span>
								</div>
								<div className="flex items-center gap-1">
									<Star className="w-4 h-4 text-accent fill-current" />
									<span className="font-medium">{rating}</span>
									<span className="text-muted-foreground">({reviews})</span>
								</div>
							</div>
							<BookingForm className="pb-6" />
						</div>
					</div>
				</div>
			)}

			{/* Photo Modal */}
			{showAllPhotos && (
				<div className="fixed inset-0 bg-background z-50 overflow-y-auto">
					<div className="max-w-7xl mx-auto px-4 py-8">
						<button
							onClick={() => setShowAllPhotos(false)}
							className="mb-4 text-primary hover:text-accent transition-colors"
						>
							← Back to listing
						</button>
						<div className="space-y-4">
							{images.map((image, index) => (
								<div key={index} className="relative aspect-[16/9]">
									<Image
										unoptimized
										src={image || "/placeholder.jpg"}
										alt={`${title} full image ${index + 1}`}
										fill
										className="object-cover rounded-xl"
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			<ReviewsSection className="pt-16 pb-20 lg:pb-16" />
		</div>
	);
}
