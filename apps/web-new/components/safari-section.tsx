import { Truck, Users, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Placeholder SVG for Elephant
function ElephantIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" fill="none" {...props}>
			<ellipse cx="12" cy="16" rx="8" ry="5" fill="currentColor" />
			<rect x="6" y="8" width="12" height="8" rx="4" fill="currentColor" />
			<circle cx="8" cy="12" r="2" fill="currentColor" />
			<rect x="16" y="12" width="2" height="4" rx="1" fill="currentColor" />
		</svg>
	);
}

// Placeholder SVG for Hot Air Balloon
function BalloonIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" fill="none" {...props}>
			<ellipse cx="12" cy="10" rx="6" ry="8" fill="#877B4E" />
			<rect x="10" y="18" width="4" height="3" rx="1" fill="#A5A58D" />
			<rect x="11" y="16" width="2" height="2" rx="1" fill="#A5A58D" />
		</svg>
	);
}

const safariActivities = [
	{
		id: "1",
		name: "Jeep Safari",
		description:
			"Experience the thrill of exploring the wild on an exciting Jeep Safari.!",
		price: "₹6,000",
		unit: "/Jeep",
		capacity: "max. Six People allowed in one Jeep",
		icon: Truck,
		image:
			"https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800",
		cta: "Explore Jeep Safari",
	},
	{
		id: "2",
		name: "Canter Safari",
		price: "₹2,500",
		unit: "/Person",
		image:
			"https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800",
		icon: Users,
		cta: "Explore Canter Safari",
	},
	{
		id: "3",
		name: "Elephant Safari",
		price: "₹3,500",
		unit: "/Elephant",
		image:
			"https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
		icon: ElephantIcon,
		cta: "Explore Elephant Safari",
	},
	{
		id: "4",
		name: "Hot Air Balloon",
		price: "₹1,500",
		unit: "/Person",
		image:
			"https://images.unsplash.com/photo-1559564667-4b013ef82b66?q=80&w=800",
		icon: BalloonIcon,
		cta: "Explore Hot Air Balloon",
	},
	// {
	//   id: "5",
	//   name: "River Rafting",
	//   price: "₹1,000",
	//   unit: "/Person",
	//   image:
	//     "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=800",
	//   icon: Waves,
	//   cta: "Explore River Rafting",
	// },
];

export function SafariSection() {
	return (
		<section className="py-16" id="safari-section">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Title and Description */}
				<div className="mb-12 text-center">
					<h2 className="text-[#9B8B6C] text-3xl font-light mb-4">
						<span className="font-bold">THRILLING ADVENTURES</span> AND
						MEMORABLE ACTIVITIES
					</h2>
					<p className="text-lg text-[#877B4E] font-light max-w-3xl mx-auto">
						Enjoy exciting safaris, peaceful hot air balloon rides, and fun
						river rafting adventures in Jim Corbett National Park.
					</p>
				</div>

				{/* Hero Section */}
				<div className="relative overflow-hidden shadow-xl mb-12">
					<img
						src="/a-rugged-open-top-safari-jeep-with-tourists-wearin.png"
						alt="Jeep Safari"
						className="w-full h-[32rem] object-cover"
					/>

					{/* Desktop Overlay */}
					<div className="hidden md:block absolute top-1/2 right-8 -translate-y-1/2 bg-white/95 backdrop-blur-sm shadow-xl p-8 max-w-md w-full flex flex-col items-start gap-4">
						<h3 className="text-3xl font-bold text-[#877B4E] mb-2">
							Jeep Safari
						</h3>
						<p className="text-[#6B705C] mb-2 font-light">
							Experience the thrill of exploring the wild on an exciting Jeep
							Safari.!
						</p>
						<div className="text-2xl font-bold text-primary">
							₹6,000{" "}
							<span className="text-base font-normal text-[#9B8B6C]">
								/Jeep
							</span>
						</div>
						<div className="text-xs text-[#9B8B6C] mb-2 font-light">
							max. Six People allowed in one Jeep
						</div>
						<button className="px-8 py-3 bg-[#2F2F2F] text-white hover:bg-[#444444] transition-colors">
							Explore Jeep Safari
						</button>
					</div>

					{/* Mobile Overlay */}
					<div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
						<div className="bg-white/95 backdrop-blur-sm shadow-xl p-4">
							<h3 className="text-xl font-bold text-[#877B4E] mb-2">
								Jeep Safari
							</h3>
							<p className="text-[#6B705C] mb-3 font-light text-sm">
								Experience the thrill of exploring the wild on an exciting Jeep
								Safari!
							</p>
							<div className="flex items-center justify-between mb-3">
								<div className="text-xl font-bold text-primary">
									₹6,000{" "}
									<span className="text-sm font-normal text-[#9B8B6C]">
										/Jeep
									</span>
								</div>
								<div className="text-xs text-[#9B8B6C] font-light">
									max. 6 People
								</div>
							</div>
							<button className="w-full px-6 py-3 bg-[#2F2F2F] text-white hover:bg-[#444444] transition-colors">
								Explore Jeep Safari
							</button>
						</div>
					</div>
				</div>

				{/* Activities Row */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{safariActivities.map((activity) => {
						const Icon = activity.icon;
						return (
							<Card
								key={activity.id}
								className="text-center rounded-none group hover:shadow-xl transition-all duration-300 h-full flex flex-col pt-0 bg-white/90 backdrop-blur-sm border-[#C2B280] hover:border-primary"
							>
								<div className="relative h-40 mb-4 overflow-hidden">
									<div
										className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
										style={{ backgroundImage: `url(${activity.image})` }}
									/>
									<div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 flex items-center justify-center">
										<Icon className="h-10 w-10 text-white" />
									</div>
								</div>
								<CardHeader className="pb-2">
									<CardTitle className="text-lg group-hover:text-primary transition-colors text-[#877B4E] font-semibold">
										{activity.name}
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 flex-1 flex flex-col justify-between">
									<div className="text-xl font-bold text-primary">
										{activity.price}
										<span className="text-base font-normal text-[#9B8B6C]">
											{activity.unit}
										</span>
									</div>
									<button className="px-8 py-2 mt-2 bg-[#2F2F2F] text-white hover:bg-[#444444] text-sm transition-colors">
										Explore Jeep Safari
									</button>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}
