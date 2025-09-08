"use client";

import { ArrowLeft, Clock, DollarSign, Edit, MapPin, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { TActivityBase } from "@repo/db/schema/activities";
import type { TActivity } from "@repo/db/index";

interface ActivityViewPageProps {
  activity: TActivity;
}

export default function ActivityViewPage({ activity }: ActivityViewPageProps) {
  const router = useRouter();

  const inclusions = activity.policies.filter(
    (policy) => policy.policy?.kind === "include"
  );
  const exclusions = activity.policies.filter(
    (policy) => policy.policy?.kind === "exclude"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{activity.name}</h1>
            <p className="text-muted-foreground">{activity.description}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/activites/${activity.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Activity
          </Link>
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">
                  {activity.name || "Not assigned"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">National Park</p>
                <p className="text-sm text-muted-foreground">
                  {activity.park?.name || "Not assigned"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      {activity.images && activity.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activity.images.map((activityImage) => (
                <div key={activityImage.id} className="relative">
                  <img
                    src={
                      activityImage.image?.medium_url ||
                      activityImage.image?.small_url
                    }
                    alt={activity.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inclusions */}
      {inclusions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Inclusions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {inclusions.map((inclusion) => (
                <li key={inclusion.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">{inclusion.policy.label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Exclusions */}
      {exclusions && exclusions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Exclusions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {exclusions.map((exclusion) => (
                <li key={exclusion.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm">{exclusion.policy.label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Itinerary */}
      {activity.itinerary && activity.itinerary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Itinerary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.itinerary.map((item, index) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    {index < activity.itinerary.length - 1 && (
                      <div className="w-px h-8 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Amenities */}
      {activity.amenities && activity.amenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {activity.amenities.map((activityAmenity) => (
                <Badge key={activityAmenity.id} variant="secondary">
                  {activityAmenity.amenity?.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Packages */}
      {activity.packages && activity.packages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activity.packages.map((package_) => (
                <div key={package_.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{package_.name}</h4>
                    <Badge variant={package_.active ? "default" : "secondary"}>
                      {package_.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Duration: {package_.duration} hours</p>
                    <p>Number: {package_.number}</p>
                    <p>Price: ₹{package_.price.toLocaleString()}</p>
                    {package_.price_1 && (
                      <p>Price 1: ₹{package_.price_1.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
