"use client";

import { Check, Clock, Star, Users } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { ActivityBookingModal } from "./activity-booking-modal";
import type { TActivityPackageBase } from "@repo/db/index";

interface Activity {
  id: number;
  name: string;
  slug?: string;
}

interface ActivityPackagesSectionProps {
  packages: TActivityPackageBase[];
  activity: Activity;
}

export function ActivityPackagesSection({
  packages,
  activity,
}: ActivityPackagesSectionProps) {
  const [selectedPackage, setSelectedPackage] =
    useState<TActivityPackageBase | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!packages || packages.length === 0) {
    return null;
  }

  const handleSelectPackage = (pkg: TActivityPackageBase) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="packages" className="py-8 border-b border-border">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Choose Your Package
          </h2>
          <p className="text-muted-foreground">
            Select the package that best fits your adventure needs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={cn(
                "relative cursor-pointer transition-all duration-300 hover:shadow-lg"
                // pkg.is_popular && "border-primary"
              )}
            >
              {/* {pkg.is_popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )} */}

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">
                    {pkg.name}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ₹{pkg.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per person
                    </div>
                  </div>
                </div>

                {/* {pkg.description && (
                  <p className="text-muted-foreground text-sm mt-2">
                    {pkg.description}
                  </p>
                )} */}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Package Details */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {pkg.duration && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.duration} Hours</span>
                    </div>
                  )}
                  {pkg.number && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Max {pkg.number}</span>
                    </div>
                  )}
                </div>

                {/* Highlights */}
                {/* {pkg.highlights && pkg.highlights.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Highlights</h4>
                    <ul className="space-y-1">
                      {pkg.highlights.slice(0, 3).map((highlight, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {highlight}
                          </span>
                        </li>
                      ))}
                      {pkg.highlights.length > 3 && (
                        <li className="text-sm text-muted-foreground ml-3.5">
                          +{pkg.highlights.length - 3} more highlights
                        </li>
                      )}
                    </ul>
                  </div>
                )} */}

                {/* Included Items */}
                {/* {pkg.included_items && pkg.included_items.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      What's Included
                    </h4>
                    <ul className="space-y-1">
                      {pkg.included_items.slice(0, 3).map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                      {pkg.included_items.length > 3 && (
                        <li className="text-sm text-muted-foreground ml-5">
                          +{pkg.included_items.length - 3} more inclusions
                        </li>
                      )}
                    </ul>
                  </div>
                )} */}

                {/* Selection Button */}
                <Button
                  variant="default"
                  className="w-full mt-4"
                  onClick={() => handleSelectPackage(pkg)}
                >
                  Book This Package
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      {selectedPackage && (
        <ActivityBookingModal
          isOpen={isModalOpen}
          onChangeState={setIsModalOpen}
          selectedPackage={selectedPackage}
          activity={activity}
        />
      )}
    </>
  );
}
