import { Clock, MapPin } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ItineraryItem {
  id: number;
  day: number;
  title: string;
  description?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  activities?: string[];
}

interface ActivityItinerarySectionProps {
  itinerary: ItineraryItem[];
}

export function ActivityItinerarySection({
  itinerary,
}: ActivityItinerarySectionProps) {
  if (!itinerary || itinerary.length === 0) {
    return null;
  }

  const formatTime = (time: string | null) => {
    if (!time) return null;
    try {
      return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return time;
    }
  };

  return (
    <section className="py-8 border-b border-border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Day-by-Day Itinerary
        </h2>
        <p className="text-muted-foreground">
          Detailed schedule of your adventure experience
        </p>
      </div>

      <div className="space-y-6">
        {itinerary
          .sort((a, b) => a.day - b.day)
          .map((item, index) => (
            <Card key={item.id} className="relative">
              {/* Timeline connector */}
              {index < itinerary.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-full bg-border -z-10" />
              )}

              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  {/* Day indicator */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {item.day}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Day {item.day}
                      </Badge>

                      {/* Time range */}
                      {(item.start_time || item.end_time) && (
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatTime(item.start_time ?? null)}
                            {item.end_time &&
                              formatTime(item.start_time ?? null) !==
                                formatTime(item.end_time) &&
                              ` - ${formatTime(item.end_time)}`}
                          </span>
                        </div>
                      )}

                      {/* Location */}
                      {item.location && (
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <MapPin className="w-3 h-3" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>

                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pl-16">
                {item.description && (
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Activities list */}
                {item.activities && item.activities.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-primary">
                      Activities & Highlights
                    </h4>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {item.activities.map((activity, actIndex) => (
                        <li
                          key={actIndex}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {activity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </section>
  );
}
