import { Button } from "@/components/ui/button";

import { ResortCard } from "./resort-card";

const featuredResorts = [
  {
    id: "1",
    name: "Corbett National Park Tour River View Retreat",
    location:
      "Zero Garjia, Corbett National Park Tour Dhikuli, Distt, Ramnagar, Uttarakhand 244715",
    rating: 5,
    originalPrice: 15000,
    discountedPrice: 13000,
    discount: 13,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800",
    amenities: ["Swimming Pool", "Bonfire", "Gym"],
    category: "Riverside" as const,
  },
  {
    id: "2",
    name: "Evara Resort & Spa",
    location: "Village Bhalon, Patkote, Ramnagar, Uttarakhand 263159",
    rating: 5,
    originalPrice: 9000,
    discountedPrice: 7000,
    discount: 22,
    image:
      "https://images.unsplash.com/photo-1559564667-4b013ef82b66?q=80&w=800",
    amenities: ["Swimming Pool", "Bonfire", "Gym"],
    category: "Luxury" as const,
  },
  {
    id: "3",
    name: "Marriott Resort And Spa Corbett National Park Tour",
    location: "Marriot Resort Dhikuli Ramnagar Uttarakhand",
    rating: 5,
    originalPrice: 27000,
    discountedPrice: 23000,
    discount: 15,
    image:
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=800",
    amenities: ["Swimming Pool", "Bonfire", "Gym"],
    category: "Luxury" as const,
  },
  {
    id: "4",
    name: "Holiday Forest Resort Corbett National Park Tour",
    location: "Holiday Forest Resort Corbett National Park Tour",
    rating: 4,
    originalPrice: 4500,
    discountedPrice: 3500,
    discount: 22,
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=800",
    amenities: ["Swimming Pool", "Bonfire", "Gym"],
    category: "Deluxe" as const,
  },
  {
    id: "5",
    name: "Corbett National Park Tour Myrica Resort",
    location: "NH 121, Dhikuli, Garjia, Ramnagar, Uttarakhand 244715",
    rating: 4,
    originalPrice: 5500,
    discountedPrice: 4000,
    discount: 27,
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800",
    amenities: ["Swimming Pool", "Bonfire", "Gym"],
    category: "Deluxe" as const,
  },
  {
    id: "6",
    name: "The Jungle Book Corbett National Park Tour Resort",
    location:
      "Village - Semal Khalia, Near, Sawaldey Flyover, behind Maya Forest Resort, Ramnagar, Uttarakhand 244715",
    rating: 4,
    originalPrice: 6000,
    discountedPrice: 4500,
    discount: 25,
    image:
      "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?q=80&w=800",
    amenities: ["Swimming Pool", "Bonfire", "Gym"],
    category: "Deluxe" as const,
  },
];

export function FeaturedForestStays() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top Forest Stays In Corbett National Park Tour
          </h2>
          <p className="text-lg text-muted-foreground mx-auto">
            We've picked the Top Forest stays in Corbett National Park Tour for
            you to choose from below so you can unwind while on vacation. These
            particular resorts are highly regarded for their features, services,
            cuisine, activities, and other aspects.
          </p>
        </div>

        <div className="flex gap-6 mb-12 overflow-x-auto px-1 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent [&::-webkit-scrollbar]:hidden py-3 pb-6">
          {featuredResorts.map((resort) => (
            <div key={resort.id} className="min-w-[24rem] flex-shrink-0">
              <ResortCard resort={resort} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline">
            See All Forest Stays
          </Button>
        </div>
      </div>
    </section>
  );
}
