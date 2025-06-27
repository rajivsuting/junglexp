import { BadgeDollarSign, CalendarCheck, LifeBuoy, ShieldCheck } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
          Why Choose Us to Explore Jim Corbett Park?
        </h2>
        <p className="text-lg text-muted-foreground mb-10">
          Trusted, Hassle-Free, and Unforgettable Experiences
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-green-100 bg-green-50/10">
            <CardContent className="flex items-start gap-4 p-6">
              <span className="bg-green-400/20 rounded-xl p-4 flex items-center justify-center">
                <LifeBuoy className="text-green-500 w-10 h-10" />
              </span>
              <div>
                <h3 className="text-xl font-bold mb-1">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Rely on our dedicated customer service team for assistance at
                  every step.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-100 bg-green-50/10">
            <CardContent className="flex items-start gap-4 p-6">
              <span className="bg-green-400/20 rounded-xl p-4 flex items-center justify-center">
                <CalendarCheck className="text-green-500 w-10 h-10" />
              </span>
              <div>
                <h3 className="text-xl font-bold mb-1">Hassle-free Bookings</h3>
                <p className="text-muted-foreground">
                  Enjoy secure and hassle-free reservations for safaris and
                  accommodations.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-100 bg-green-50/10">
            <CardContent className="flex items-start gap-4 p-6">
              <span className="bg-green-400/20 rounded-xl p-4 flex items-center justify-center">
                <ShieldCheck className="text-green-500 w-10 h-10" />
              </span>
              <div>
                <h3 className="text-xl font-bold mb-1">Trust & Safety</h3>
                <p className="text-muted-foreground">
                  Benefit from our expertise in Jim Corbett National Park for a
                  perfectly planned safari experience.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-100 bg-green-50/10">
            <CardContent className="flex items-start gap-4 p-6">
              <span className="bg-green-400/20 rounded-xl p-4 flex items-center justify-center">
                <BadgeDollarSign className="text-green-500 w-10 h-10" />
              </span>
              <div>
                <h3 className="text-xl font-bold mb-1">Best Price Guarantee</h3>
                <p className="text-muted-foreground">
                  Experience top-notch services at the most competitive rates,
                  with no hidden charges.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
