import {
    Car, Coffee, Dumbbell, Flower2, Gamepad2, Hotel, ShoppingBag, TreePine, Users, UtensilsCrossed,
    Waves, Wifi
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const amenities = [
  {
    icon: Waves,
    title: "Private Beach",
    description:
      "Exclusive access to pristine white sand beach with crystal clear waters and water sports equipment.",
  },
  {
    icon: Dumbbell,
    title: "Fitness Center",
    description:
      "State-of-the-art gym with modern equipment, personal trainers, and group fitness classes.",
  },
  {
    icon: UtensilsCrossed,
    title: "Fine Dining",
    description:
      "Multiple award-winning restaurants featuring international cuisine and local specialties.",
  },
  {
    icon: Wifi,
    title: "High-Speed WiFi",
    description:
      "Complimentary high-speed internet access throughout the resort and in all rooms.",
  },
  {
    icon: Car,
    title: "Valet Parking",
    description:
      "Complimentary valet parking service with 24/7 security for your peace of mind.",
  },
  {
    icon: Users,
    title: "Conference Facilities",
    description:
      "Professional meeting rooms and event spaces with full audiovisual equipment.",
  },
  {
    icon: Gamepad2,
    title: "Entertainment",
    description:
      "Game room, live entertainment, themed nights, and cultural performances.",
  },
  {
    icon: TreePine,
    title: "Nature Trails",
    description:
      "Guided nature walks and hiking trails through tropical gardens and wildlife areas.",
  },
  {
    icon: Flower2,
    title: "Spa & Wellness",
    description:
      "Full-service spa with massage therapy, wellness treatments, and meditation spaces.",
  },
  {
    icon: Hotel,
    title: "Concierge Service",
    description:
      "24/7 concierge assistance for reservations, tours, and personalized recommendations.",
  },
  {
    icon: ShoppingBag,
    title: "Gift Shop",
    description:
      "Resort boutique with souvenirs, beachwear, and essential items for your convenience.",
  },
  {
    icon: Coffee,
    title: "Pool Bar",
    description:
      "Poolside bar and lounge with tropical cocktails, fresh juices, and light snacks.",
  },
];

export function Amenities() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Resort Amenities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Indulge in our extensive range of world-class facilities and
            services designed to make your stay extraordinary and memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => {
            const IconComponent = amenity.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors duration-300">
                    <IconComponent className="h-8 w-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {amenity.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center text-gray-600 text-sm leading-relaxed">
                    {amenity.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Resort Features */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              More Than Just a Stay
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our resort offers an unparalleled experience with carefully
              curated activities and services that cater to every guest&apos;s
              needs and preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="h-10 w-10 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Water Activities
              </h4>
              <p className="text-gray-600 text-sm">
                Snorkeling, diving, kayaking, jet skiing, and sailing with
                professional instructors.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TreePine className="h-10 w-10 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Eco Adventures
              </h4>
              <p className="text-gray-600 text-sm">
                Nature tours, bird watching, tropical garden visits, and
                sustainable tourism experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flower2 className="h-10 w-10 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Wellness Programs
              </h4>
              <p className="text-gray-600 text-sm">
                Yoga classes, meditation sessions, wellness workshops, and
                holistic healing treatments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
