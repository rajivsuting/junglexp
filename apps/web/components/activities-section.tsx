import { Truck, Users, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: "1",
    name: "Jeep Safari",
    description:
      "Experience the thrill of exploring the wild on an exciting Jeep Safari!",
    price: "₹6,000/Jeep",
    capacity: "max. Six People allowed in one Jeep",
    icon: Truck,
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800",
  },
  {
    id: "2",
    name: "Canter Safari",
    description:
      "Enjoy a comfortable group safari experience with our spacious canter vehicles.",
    price: "₹2,500/Person",
    capacity: "Group activity for wildlife viewing",
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800",
  },
  // {
  //   id: "3",
  //   name: "Hot Air Balloon",
  //   description:
  //     "Get a bird's eye view of the stunning Jim Corbett landscape from above.",
  //   price: "₹1,500/Person",
  //   capacity: "Aerial adventure experience",
  //   icon: Balloon,
  //   image:
  //     "https://images.unsplash.com/photo-1559564667-4b013ef82b66?q=80&w=800",
  // },
  {
    id: "4",
    name: "River Rafting",
    description:
      "Experience thrilling white water rafting on the pristine rivers near Corbett.",
    price: "₹1,000/Person",
    capacity: "Adventure water sports",
    icon: Waves,
    image:
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=800",
  },
];

export function ActivitiesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Thrilling Adventures and Memorable Activities in Jim Corbett Park
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Enjoy exciting safaris, peaceful hot air balloon rides, and fun
            river rafting adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <Card
                key={activity.id}
                className="text-center group hover:shadow-lg transition-all duration-300 h-full flex flex-col pt-0"
              >
                <div className="relative h-48 mb-4 overflow-hidden rounded-t-lg">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(${activity.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Icon className="h-12 w-12 text-white" />
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {activity.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>

                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {activity.price}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.capacity}
                    </div>
                  </div>

                  <Button size="sm" variant="gradient" className="w-full mt-4">
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
