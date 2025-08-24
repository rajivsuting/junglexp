"use client";

import {
  ChevronDown,
  Clock,
  Filter,
  Heart,
  Search,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

// Mock data for activities
const activities = [
  {
    id: 1,
    title: "Jim Corbett Jeep Safari - Morning Adventure",
    description:
      "Experience the thrill of exploring the wild on an exciting Morning Jeep Safari",
    duration: "3 hours",
    groupSize: "Small group",
    price: 1740,
    originalPrice: 1945,
    rating: 4.4,
    reviewCount: 65724,
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800",
    isTopPick: true,
    isLikelyToSellOut: false,
    badges: ["Optional audio guide"],
    category: "safari",
  },
  {
    id: 2,
    title: "Jim Corbett Evening River Cruise with Music",
    description:
      "Enjoy a peaceful evening cruise along the Kosi River with live music",
    duration: "1 hour",
    groupSize: "Any size",
    price: 2354,
    originalPrice: null,
    rating: 4.3,
    reviewCount: 19377,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800",
    isTopPick: false,
    isLikelyToSellOut: true,
    badges: [],
    category: "cruise",
  },
  {
    id: 3,
    title: "Corbett Forest Walk and Mindfulness Experience",
    description:
      "A guided meditation and mindfulness walk through the peaceful forest trails",
    duration: "2.5 hours",
    groupSize: "Small group",
    price: 3583,
    originalPrice: null,
    rating: 4.5,
    reviewCount: 8432,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800",
    isTopPick: false,
    isLikelyToSellOut: false,
    badges: ["New activity"],
    category: "nature",
  },
  {
    id: 4,
    title: "Wildlife Photography Tour - Skip the Line",
    description:
      "Professional wildlife photography experience with expert guidance",
    duration: "1 day",
    groupSize: "Skip the line",
    price: 2252,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 69859,
    image:
      "https://images.unsplash.com/photo-1549366021-9f761d040a94?q=80&w=800",
    isTopPick: false,
    isLikelyToSellOut: true,
    badges: ["Certified by GetYourGuide"],
    category: "photography",
  },
  {
    id: 5,
    title: "Elephant Safari Adventure",
    description: "Traditional elephant back safari through the national park",
    duration: "2 hours",
    groupSize: "Small group",
    price: 4200,
    originalPrice: null,
    rating: 4.2,
    reviewCount: 12456,
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
    isTopPick: false,
    isLikelyToSellOut: false,
    badges: [],
    category: "safari",
  },
  {
    id: 6,
    title: "Hot Air Balloon Over Corbett",
    description:
      "Breathtaking aerial views of the national park from a hot air balloon",
    duration: "3 hours",
    groupSize: "Small group",
    price: 8500,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 3421,
    image:
      "https://images.unsplash.com/photo-1559564667-4b013ef82b66?q=80&w=800",
    isTopPick: true,
    isLikelyToSellOut: false,
    badges: ["Premium experience"],
    category: "adventure",
  },
  {
    id: 7,
    title: "Canter Safari Group Experience",
    description:
      "Affordable group safari experience in an open-top canter vehicle",
    duration: "4 hours",
    groupSize: "Large group",
    price: 1200,
    originalPrice: null,
    rating: 4.1,
    reviewCount: 23891,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800",
    isTopPick: false,
    isLikelyToSellOut: false,
    badges: [],
    category: "safari",
  },
  {
    id: 8,
    title: "Bird Watching Tour with Expert Guide",
    description:
      "Early morning bird watching experience with professional ornithologist",
    duration: "4 hours",
    groupSize: "Small group",
    price: 2800,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 5632,
    image:
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=800",
    isTopPick: false,
    isLikelyToSellOut: false,
    badges: ["Expert guide"],
    category: "nature",
  },
];

const categories = [
  { id: "all", name: "All Activities" },
  { id: "safari", name: "Safari Tours" },
  { id: "nature", name: "Nature Walks" },
  { id: "adventure", name: "Adventure Sports" },
  { id: "cruise", name: "River Cruises" },
  { id: "photography", name: "Photography" },
];

const sortOptions = [
  { id: "recommended", name: "Recommended" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "rating", name: "Highest Rated" },
  { id: "duration", name: "Duration" },
];

export default function SafarisAndActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [likedActivities, setLikedActivities] = useState<number[]>([]);

  const filteredActivities = activities.filter(
    (activity) =>
      selectedCategory === "all" || activity.category === selectedCategory
  );

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "duration":
        return a.duration.localeCompare(b.duration);
      default:
        return 0;
    }
  });

  const toggleLike = (activityId: number) => {
    setLikedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Safaris & Activities in Jim Corbett
          </h1>
          <p className="text-gray-600 mb-4">
            {filteredActivities.length} activities found
          </p>

          {/* Search and Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            {/* <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search activities..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div> */}

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedActivities.map((activity) => (
            <Card
              key={activity.id}
              className="group hover:shadow-lg gap-2 pt-0 transition-all duration-300 overflow-hidden"
            >
              {/* Image Section */}
              <CardHeader className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {activity.isTopPick && (
                      <Badge className="bg-blue-600 text-white px-2 py-1 text-xs">
                        Top pick
                      </Badge>
                    )}
                    {activity.isLikelyToSellOut && (
                      <Badge className="bg-red-600 text-white px-2 py-1 text-xs">
                        Likely to sell out
                      </Badge>
                    )}
                    {activity.badges.map((badge, index) => (
                      <Badge
                        key={index}
                        className="bg-green-600 text-white px-2 py-1 text-xs"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(activity.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        likedActivities.includes(activity.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                </div>
              </CardHeader>

              {/* Content Section */}
              <CardContent className="p-4 py-0">
                <h3 className="font-bold text-md mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                  {activity.title}
                </h3>

                {/* Duration and Group Size */}
                <div className="flex items-center gap-4 mb-3 text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{activity.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{activity.groupSize}</span>
                  </div>
                </div>

                {/* Rating and Price Footer */}

                <div className="w-full">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(activity.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : i < activity.rating
                                ? "fill-yellow-400/50 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-sm text-gray-900">
                      {activity.rating}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({activity.reviewCount.toLocaleString()})
                    </span>
                  </div>
                </div>
              </CardContent>
              <div className="flex flex-1" />
              <CardFooter className="px-4 py-0">
                {/* Price */}
                <div className="pt-4">
                  <span className="text- text-sm">From</span>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{activity.price.toLocaleString()}
                    <span className="text-sm font-normal text-gray-600 ml-1">
                      per person
                    </span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            Load More Activities
          </Button>
        </div>
      </div>
    </div>
  );
}
