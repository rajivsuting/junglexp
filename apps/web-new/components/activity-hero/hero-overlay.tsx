import { ArrowLeft, Heart, MapPin, Share2, Star } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeroOverlayProps {
	activityName: string;
	location: string;
	difficulty: string;
	duration: string;
	rating: number;
	reviewCount: number;
	onWishlistToggle?: () => void;
	isWishlisted?: boolean;
}

export function HeroOverlay({
	activityName,
	location,
	difficulty,
	duration,
	rating,
	reviewCount,
}: HeroOverlayProps) {
	return (
		<>
			{/* Modern gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70 z-20" />

			{/* Glassmorphic Navigation Bar */}
			{/* <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-30">
        <Link href="/activities">
          <Button
            variant="outline"
            className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 rounded-2xl px-6 py-3 shadow-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 rounded-2xl shadow-xl"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 rounded-2xl shadow-xl"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div> */}

			{/* Modern Hero Content */}
			<div className="absolute inset-x-4 bottom-8 z-30 text-white">
				<div className="max-w-5xl mx-auto">
					<div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
						<Badge className="bg-primary  text-white border-0 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
							{difficulty}
						</Badge>
						<Badge className="backdrop-blur-xl bg-white/20 border-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold">
							{duration}
						</Badge>
					</div>
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-none tracking-tight drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
						{activityName}
					</h1>
					<div className="flex flex-wrap items-center gap-6 text-lg sm:text-xl backdrop-blur-sm bg-black/20 rounded-2xl p-4 border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
						<div className="flex items-center gap-2">
							<MapPin className="h-5 w-5 text-amber-400" />
							<span className="font-medium">{location}</span>
						</div>
						<div className="flex items-center gap-2">
							<Star className="h-5 w-5 fill-current text-amber-400" />
							<span className="font-medium">{rating}</span>
							<span className="text-white/80">({reviewCount} reviews)</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
