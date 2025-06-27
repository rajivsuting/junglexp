import { CalendarDays, Search, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/tiger-close-up-walking-in-a-dense-forest.png')",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Book Your Ideal Stay At{" "}
          <span className="text-yellow-400">Jim Corbett Resorts</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Experience the wilderness and luxury in India's oldest national park
        </p>

        {/* Search Form */}
        {/* <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Check In - Check Out
                </label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input placeholder="Select dates" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Hotel Type
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hotel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homestay">Home Stay & Villas</SelectItem>
                    <SelectItem value="deluxe">Deluxe Hotels</SelectItem>
                    <SelectItem value="luxury">Luxury Hotels</SelectItem>
                    <SelectItem value="premium">Premium Hotels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Guests
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input placeholder="2 Adults" className="pl-10" />
                </div>
              </div>

              <Button size="lg" className="w-full">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card> */}

        <div className="gap-2">
          <Button variant="gradient" size="lg" className="mr-2">
            <span>View All Activities</span>
          </Button>

          <Button variant="gradient" size="lg">
            <span>View Safari</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

/**
 * reference? compititor
 * zone? only in corbett
 * packages
 * activities
 * blog nahi bola hai
 * safaris
 * resorts
 *
 *
 *
 *
 *
 *
 */
