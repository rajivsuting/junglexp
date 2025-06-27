"use client";

import { ArrowDown, Compass } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function ActivitiesHero() {
  const scrollToActivities = () => {
    document.getElementById("safari-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/">
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black"
          >
            ← Back to Resort
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Compass className="h-16 w-16 text-amber-400 mr-4" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Adventure
            <span className="block text-amber-400">Awaits</span>
          </h1>
        </div>

        <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Embark on thrilling adventures and unforgettable experiences. From
          wildlife safaris to paragliding adventures, discover the excitement
          that awaits beyond our resort.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg"
            onClick={scrollToActivities}
          >
            Explore Adventures
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
            onClick={scrollToActivities}
          >
            View All Activities
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">15+</div>
            <div>Adventures</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">24/7</div>
            <div>Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">100%</div>
            <div>Safe</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">Expert</div>
            <div>Guides</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <ArrowDown size={24} />
      </div>
    </section>
  );
}
