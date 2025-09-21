import { Card } from '@/components/ui/card';

import type { TActivityItineraryBase } from "@repo/db/index";

interface ActivityItinerarySectionProps {
  itinerary: TActivityItineraryBase[];
}

export function ActivityItinerarySection({
  itinerary,
}: ActivityItinerarySectionProps) {
  if (!itinerary || itinerary.length === 0) {
    return null;
  }

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

      <div className="space-y-4">
        {itinerary.map((item, index) => {
          const parseLabelValue = (line: string | undefined) => {
            if (!line) return null;
            const parts = line.split(":");
            const head = parts.shift() ?? "";
            const value = parts.join(":").trim();
            return { label: head.trim(), value };
          };

          return (
            <Card
              key={item.id}
              className="relative rounded-xl border border-primary/60 shadow-sm"
            >
              <div className="px-4">
                <span className="inline-flex items-center rounded-full border border-primary text-primary font-medium px-2.5 py-0.5 text-xs">
                  Day {index + 1}
                </span>

                <h3 className="mt-3 text-lg sm:text-xl font-semibold text-primary">
                  {item.title}
                </h3>

                <span className="text-sm text-primary">{item.description}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
