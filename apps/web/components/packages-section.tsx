import { ArrowRight, Calendar, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const packages = [
  {
    id: "1",
    name: "Corbett National Park Tour Nainital Tour",
    duration: "4 Night / 5 Day",
    price: 16000,
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800",
    highlights: [
      "Corbett National Park Tour Safari",
      "Nainital Sightseeing",
      "Lake Boat Ride",
    ],
  },
  {
    id: "2",
    name: "Corbett National Park Tour Budget Tour",
    duration: "1 Night / 2 Day",
    price: 4800,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800",
    highlights: ["Jeep Safari", "Nature Walk", "Bird Watching"],
  },
  {
    id: "3",
    name: "Corbett National Park Tour Corporate Group Packages",
    duration: "1 Night / 2 Day",
    price: 3000,
    image:
      "https://images.unsplash.com/photo-1559564667-4b013ef82b66?q=80&w=800",
    highlights: ["Team Activities", "Conference Hall", "Group Safari"],
  },
  {
    id: "4",
    name: "Corbett National Park Tour School Group Packages",
    duration: "1 Night / 2 Day",
    price: 1100,
    image:
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=800",
    highlights: ["Educational Safari", "Nature Learning", "Group Activities"],
  },
  {
    id: "5",
    name: "Jhirna Night Stay Package",
    duration: "1 Night / 2 Day",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=800",
    highlights: ["Night Safari", "Wildlife Photography", "Jungle Stay"],
  },
  {
    id: "6",
    name: "Corbett National Park Tour Green Retreat Resort Holi Package",
    duration: "2 Night / 3 Day",
    price: 14999,
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800",
    highlights: ["Holi Celebration", "Cultural Activities", "Special Meals"],
  },
];

export function PackagesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Uncover the Best Corbett National Park Tour Packages for Your
            Perfect Escape
          </h2>
          <p className="text-lg text-muted-foreground mx-auto">
            Explore Tailored Experiences with Stay, Adventure, and Nature in One
            Perfect Package
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className="overflow-hidden group hover:shadow-lg transition-all duration-300 pt-0 h-full flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${pkg.image})` }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-700">
                  {pkg.duration}
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {pkg.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0 flex-1">
                <div className="space-y-2 mb-4">
                  {pkg.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-muted-foreground"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 text-primary" />
                      {highlight}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">
                      ₹{pkg.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /Per Person
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0 mt-auto">
                <Button variant="gradient" className="w-full">
                  Book Package
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline">
            See All Packages
          </Button>
        </div>
      </div>
    </section>
  );
}
