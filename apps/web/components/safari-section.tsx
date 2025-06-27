import { Truck, Users, Waves } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder SVG for Elephant
function ElephantIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <ellipse cx="12" cy="16" rx="8" ry="5" fill="#888" />
      <rect x="6" y="8" width="12" height="8" rx="4" fill="#aaa" />
      <circle cx="8" cy="12" r="2" fill="#888" />
      <rect x="16" y="12" width="2" height="4" rx="1" fill="#888" />
    </svg>
  );
}

// Placeholder SVG for Hot Air Balloon
function BalloonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <ellipse cx="12" cy="10" rx="6" ry="8" fill="#4fd1c5" />
      <rect x="10" y="18" width="4" height="3" rx="1" fill="#fbbf24" />
      <rect x="11" y="16" width="2" height="2" rx="1" fill="#fbbf24" />
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
    <section className="py-16 bg-gray-50" id="safari-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title and Description */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Thrilling Adventures and Memorable Activities in Jim Corbett Park
          </h2>
          <p className="text-lg text-muted-foreground">
            Enjoy exciting safaris, peaceful hot air balloon rides, and fun
            river rafting adventures.
          </p>
        </div>
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg mb-12">
          <img
            src="/a-rugged-open-top-safari-jeep-with-tourists-wearin.png"
            alt="Jeep Safari"
            className="w-full h-[32rem] object-cover"
          />
          <div className="absolute top-1/2 right-8 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-start gap-4">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-2">
              Jeep Safari
            </h3>
            <p className="text-muted-foreground mb-2">
              Experience the thrill of exploring the wild on an exciting Jeep
              Safari.!
            </p>
            <div className="text-2xl font-bold text-gray-900">
              ₹6,000{" "}
              <span className="text-base font-normal text-gray-500">/Jeep</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              max. Six People allowed in one Jeep
            </div>
            <Button
              className="mt-2 px-6 py-2 text-base font-semibold"
              size="lg"
            >
              Explore Jeep Safari
            </Button>
          </div>
        </div>
        {/* Activities Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {safariActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <Card
                key={activity.id}
                className="text-center group hover:shadow-lg transition-all duration-300 h-full flex flex-col pt-0"
              >
                <div className="relative h-40 mb-4 overflow-hidden rounded-t-lg">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(${activity.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {activity.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 flex-1 flex flex-col justify-between">
                  <div className="text-xl font-bold text-primary">
                    {activity.price}
                    <span className="text-base font-normal text-gray-500">
                      {activity.unit}
                    </span>
                  </div>
                  <Button size="sm" variant="gradient" className="w-full mt-2">
                    {activity.cta}
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
