"use client";

import { format } from "date-fns";
import {
  Award,
  CalendarIcon,
  Camera,
  Check,
  Clock,
  Mountain,
  Shield,
  Star,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { HeroSection } from "./activity-hero/hero-section";

// Sample activity data
const activityData = {
  id: "himalayan-trek",
  name: "Corbett National Park Safari",
  location: "Nepal Himalayas",
  duration: "14 days",
  price: 2499,
  rating: 4.8,
  reviewCount: 127,
  difficulty: "Challenging",
  maxGroupSize: 12,
  images: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1464822759844-d150baec93d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  ],
  highlights: [
    "Reach Everest Base Camp at 5,364m",
    "Experience Sherpa culture and hospitality",
    "Visit ancient monasteries and temples",
    "Witness stunning Himalayan sunrise views",
    "Trek through diverse landscapes",
  ],
  overview:
    "Embark on the adventure of a lifetime with our Himalayan Base Camp Trek. This 14-day journey takes you through some of the world's most spectacular mountain scenery, offering breathtaking views of the world's highest peaks including Mount Everest, Lhotse, and Nuptse. Experience the unique Sherpa culture, visit ancient Buddhist monasteries, and challenge yourself on this unforgettable trek to Everest Base Camp.",
  included: [
    "All accommodation during trek (tea houses)",
    "Professional English-speaking guide",
    "Porter service (2:1 ratio)",
    "All meals during the trek",
    "Sagarmatha National Park permits",
    "TIMS (Trekkers' Information Management System) card",
    "First aid kit and emergency oxygen",
    "Airport transfers in Kathmandu",
    "Domestic flights (Kathmandu-Lukla-Kathmandu)",
    "Pre-trek briefing and equipment check",
  ],
  excluded: [
    "International flights to/from Nepal",
    "Nepal visa fees",
    "Travel and rescue insurance",
    "Personal trekking equipment",
    "Extra meals in Kathmandu",
    "Personal expenses (laundry, phone calls, etc.)",
    "Tips for guides and porters",
    "Alcoholic beverages and soft drinks",
    "Hot showers and WiFi charges during trek",
    "Emergency helicopter evacuation",
  ],
  itinerary: [
    {
      day: 1,
      title: "Arrival in Kathmandu",
      description:
        "Arrive at Tribhuvan International Airport. Transfer to hotel and trek briefing.",
      activities: [
        "Airport pickup",
        "Hotel check-in",
        "Welcome dinner",
        "Trek briefing",
      ],
      accommodation: "Hotel in Thamel",
      meals: "Dinner",
    },
    {
      day: 2,
      title: "Fly to Lukla, Trek to Phakding",
      description:
        "Early morning flight to Lukla (2,840m). Begin trek to Phakding village.",
      activities: [
        "Flight to Lukla",
        "Trek to Phakding",
        "Visit local monastery",
      ],
      accommodation: "Tea house in Phakding",
      meals: "Breakfast, Lunch, Dinner",
      trekking: "3-4 hours",
    },
    {
      day: 3,
      title: "Phakding to Namche Bazaar",
      description:
        "Cross suspension bridges over Dudh Koshi river. Climb to Namche Bazaar, the Sherpa capital.",
      activities: [
        "River crossings",
        "Hillary Bridge",
        "First Everest views",
        "Namche arrival",
      ],
      accommodation: "Tea house in Namche Bazaar",
      meals: "Breakfast, Lunch, Dinner",
      trekking: "6-7 hours",
    },
    {
      day: 4,
      title: "Acclimatization Day in Namche",
      description:
        "Rest day for altitude acclimatization. Optional hike to Everest View Hotel.",
      activities: [
        "Visit Sherpa Museum",
        "Everest View Hotel hike",
        "Explore Namche market",
      ],
      accommodation: "Tea house in Namche Bazaar",
      meals: "Breakfast, Lunch, Dinner",
      trekking: "3-4 hours (optional)",
    },
    {
      day: 5,
      title: "Namche to Tengboche",
      description:
        "Trek through rhododendron forests to Tengboche monastery with panoramic mountain views.",
      activities: [
        "Rhododendron forest",
        "Tengboche monastery visit",
        "Mountain panorama",
      ],
      accommodation: "Tea house in Tengboche",
      meals: "Breakfast, Lunch, Dinner",
      trekking: "5-6 hours",
    },
  ],
};

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    rating: 5,
    date: "2024-01-15",
    title: "Life-changing experience!",
    comment:
      "This trek exceeded all my expectations. The guides were incredibly knowledgeable and the views were absolutely breathtaking. The tea houses were cozy and the food was surprisingly good. Highly recommend!",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    rating: 5,
    date: "2024-01-08",
    title: "Well organized and professional",
    comment:
      "The entire experience was flawlessly organized. Our guide was amazing and really helped us understand the local culture. The acclimatization schedule was perfect and I felt prepared for the altitude.",
  },
  {
    id: 3,
    name: "Emma Williams",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    rating: 4,
    date: "2023-12-22",
    title: "Challenging but rewarding",
    comment:
      "This was definitely challenging, but that's what made it so rewarding. The support from the team was excellent and the views of Everest were unforgettable. Some days were tough, but totally worth it!",
  },
];

export function ActivityDetail({ activityId }: { activityId: string }) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [participants, setParticipants] = useState("2");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const [activeSection, setActiveSection] = useState("itinerary");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Add some offset for better positioning
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["itinerary", "includes", "reviews"];
      const scrollPosition = window.scrollY + 150;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedDate ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email
    ) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields and select a date.",
      });
      return;
    }

    toast.error("Booking Request Submitted!", {
      description: "We'll contact you within 24 hours to confirm your booking.",
    });
  };

  const calculateTotal = () => {
    return activityData.price * parseInt(participants);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <HeroSection
        images={activityData.images}
        activityName={activityData.name}
        location={activityData.location}
        difficulty={activityData.difficulty}
        duration={activityData.duration}
        rating={activityData.rating}
        reviewCount={activityData.reviewCount}
        autoPlay
        interval={5000}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Activity Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Modern Overview */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 rounded-3xl overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg">
                    <Mountain className="h-6 w-6 text-white" />
                  </div>
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-700 leading-relaxed text-lg">
                  {activityData.overview}
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      icon: Clock,
                      label: activityData.duration,
                      color: "from-blue-400 to-blue-600",
                    },
                    {
                      icon: Users,
                      label: `Max ${activityData.maxGroupSize} people`,
                      color: "from-green-400 to-green-600",
                    },
                    {
                      icon: Award,
                      label: activityData.difficulty,
                      color: "from-purple-400 to-purple-600",
                    },
                    {
                      icon: Camera,
                      label: "Photo spots",
                      color: "from-pink-400 to-pink-600",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div
                        className={cn(
                          "p-2 bg-gradient-to-br rounded-xl shadow-md",
                          item.color
                        )}
                      >
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Modern Highlights */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-amber-50 rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  Experience Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activityData.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-amber-200 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex-shrink-0 shadow-md" />
                      <span className="text-slate-700 font-medium">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Modern Navigation */}
            <div className="w-full">
              <div className="flex bg-white rounded-2xl p-2 shadow-xl border border-slate-200 mb-10">
                {[
                  { id: "itinerary", label: "Day by Day" },
                  { id: "includes", label: "What's Included" },
                  { id: "reviews", label: "Reviews" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={cn(
                      "flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300",
                      activeSection === tab.id
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg"
                        : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Modern Itinerary Section */}
              <div id="itinerary" className="mb-16">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 rounded-3xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-800">
                      Day-by-Day Itinerary
                    </CardTitle>
                    <CardDescription className="text-lg text-slate-600">
                      Detailed breakdown of your {activityData.duration}{" "}
                      adventure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {activityData.itinerary.map((day) => (
                      <div key={day.day} className="relative pl-8">
                        <div className="absolute left-0 top-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {day.day}
                          </span>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 ml-4">
                          <div className="mb-4">
                            <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white border-0 mb-3">
                              Day {day.day}
                            </Badge>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                              {day.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                              {day.description}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">
                                Activities
                              </h4>
                              <ul className="space-y-2">
                                {day.activities.map((activity, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center gap-2 text-slate-600"
                                  >
                                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-1">
                                  Accommodation
                                </h4>
                                <p className="text-slate-600">
                                  {day.accommodation}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-1">
                                  Meals
                                </h4>
                                <p className="text-slate-600">{day.meals}</p>
                              </div>
                              {day.trekking && (
                                <div>
                                  <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-1">
                                    Trekking
                                  </h4>
                                  <p className="text-slate-600">
                                    {day.trekking}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Modern Includes/Excludes Section */}
              <div id="includes" className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-white rounded-3xl overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl font-bold text-green-700">
                        <div className="p-2 bg-gradient-to-r from-green-400 to-green-600 rounded-xl shadow-lg">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                        What&apos;s Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {activityData.included.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 p-3 bg-white rounded-xl border border-green-200 shadow-sm"
                          >
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-white rounded-3xl overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl font-bold text-red-700">
                        <div className="p-2 bg-gradient-to-r from-red-400 to-red-600 rounded-xl shadow-lg">
                          <X className="h-5 w-5 text-white" />
                        </div>
                        Not Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {activityData.excluded.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 p-3 bg-white rounded-xl border border-red-200 shadow-sm"
                          >
                            <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Modern Reviews Section */}
              <div id="reviews" className="mb-16">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 rounded-3xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-800">
                      Guest Reviews
                    </CardTitle>
                    <CardDescription className="text-lg text-slate-600">
                      See what our adventurers are saying about this experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
                      >
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12 border-2 border-slate-200 shadow-md">
                            <AvatarImage
                              src={review.avatar}
                              alt={review.name}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold">
                              {review.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="font-bold text-slate-800">
                                {review.name}
                              </h4>
                              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-3 w-3",
                                      i < review.rating
                                        ? "text-amber-400 fill-current"
                                        : "text-slate-300"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-slate-500">
                                {format(new Date(review.date), "MMM dd, yyyy")}
                              </span>
                            </div>
                            <h5 className="font-semibold text-slate-800 mb-2">
                              {review.title}
                            </h5>
                            <p className="text-slate-600 leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Modern Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 rounded-3xl pt-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r p-6 from-amber-400 to-orange-500 text-white">
                  <CardTitle className="flex items-center justify-between text-xl">
                    <span className="font-bold">Book This Adventure</span>
                    <Badge className="bg-white text-amber-600 text-xl font-black px-3 py-1 rounded-xl">
                      ${activityData.price}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-amber-100">
                    Per person • {activityData.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleBooking} className="space-y-6">
                    {/* Date Selection */}
                    <div className="space-y-3">
                      <Label className="text-slate-800 font-semibold">
                        Select Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal rounded-xl border-slate-300 h-12",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-3 h-4 w-4" />
                            {selectedDate
                              ? format(selectedDate, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Participants */}
                    <div className="space-y-3">
                      <Label className="text-slate-800 font-semibold">
                        Number of Participants
                      </Label>
                      <Select
                        value={participants}
                        onValueChange={setParticipants}
                      >
                        <SelectTrigger className="rounded-xl border-slate-300 h-12">
                          <SelectValue placeholder="Select participants" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(activityData.maxGroupSize)].map((_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              {i + 1} {i + 1 === 1 ? "Person" : "People"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label className="text-slate-800 font-semibold">
                          First Name*
                        </Label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          className="rounded-xl border-slate-300 h-12"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-slate-800 font-semibold">
                          Last Name*
                        </Label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          className="rounded-xl border-slate-300 h-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-800 font-semibold">
                        Email*
                      </Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="rounded-xl border-slate-300 h-12"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-800 font-semibold">
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="rounded-xl border-slate-300 h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-800 font-semibold">
                        Special Requests
                      </Label>
                      <Textarea
                        value={formData.specialRequests}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specialRequests: e.target.value,
                          })
                        }
                        placeholder="Any dietary restrictions, medical conditions, or special requirements..."
                        className="rounded-xl border-slate-300 min-h-[100px]"
                        rows={3}
                      />
                    </div>

                    {/* Price Summary */}
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between text-slate-700">
                        <span>
                          ${activityData.price} x {participants} people
                        </span>
                        <span className="font-semibold">
                          ${calculateTotal()}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg text-slate-800 border-t border-slate-200 pt-3">
                        <span>Total</span>
                        <span className="text-amber-600">
                          ${calculateTotal()}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="gradient"
                      className="w-full py-4 rounded-2xl"
                      size="lg"
                    >
                      Book Now
                    </Button>

                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-green-50 p-3 rounded-xl border border-green-200">
                      <div className="p-1 bg-green-200 rounded-lg">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <span>
                        Free cancellation up to 7 days before departure
                      </span>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
