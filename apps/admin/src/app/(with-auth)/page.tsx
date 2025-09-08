import {
  CalendarDays,
  Hotel,
  MapPin,
  Package,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <PageContainer scrollable>
      <div className="min-h-screen overflow-y-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to eTroupers Admin
            </h1>
            <p className="text-muted-foreground">
              Manage your safari destinations, hotels, tours, and more from your
              centralized dashboard.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Hotels
                </CardTitle>
                <Hotel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  National Parks
                </CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 new this quarter
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Tours
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">189</div>
                <p className="text-xs text-muted-foreground">
                  +8 scheduled today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹12,45,678</div>
                <p className="text-xs text-muted-foreground">
                  +18% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-5 w-5" />
                  Hotels Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Manage hotel listings, amenities, pricing, and availability
                  across all destinations.
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href="/hotels">View Hotels</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/hotels/new">Add New</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  National Parks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Configure park information, zones, activities, and safari
                  schedules.
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href="/national-parks">View Parks</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/national-parks/new">Add New</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Souvenirs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Manage souvenir inventory, pricing, and availability by
                  location.
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href="/souvenirs">View Items</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/souvenirs/new">Add New</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Tours & Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Schedule and manage safari tours, activities, and adventure
                  packages.
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href="/tours">View Tours</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/activites">View Activities</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/activites/new">Add Activity</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Promotions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Create and manage promotional campaigns, discounts, and
                  special offers.
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href="/promotions">View Offers</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/promotions/new">Create New</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Zones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Define and manage safari zones, boundaries, and access
                  permissions.
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href="/zones">View Zones</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/zones/new">Add Zone</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      New hotel "Safari Lodge Corbett" added
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Tour package "Wildlife Photography" updated
                    </p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Zone "Buffer Area 2" permissions modified
                    </p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Promotion "Early Bird Safari" activated
                    </p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
