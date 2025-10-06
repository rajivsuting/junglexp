import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getNationalParkBySlug } from '@repo/actions/parks.actions';
import { getSouvenirs } from '@repo/actions/souvenirs.actions';

import type { TSouvenir } from "@repo/db";

type PageProps = {
  params: Promise<{ "park-id": string }>;
};

export default async function ParkSouvenirsPage(props: PageProps) {
  const params = await props.params;

  const park = await getNationalParkBySlug(params["park-id"]);
  if (!park) return notFound();

  const { data: souvenirs = [] } = await getSouvenirs({
    park: String(park.id),
    availability: true,
    page: 1,
    limit: 36,
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-semibold">New Arrivals • Souvenirs</h1>
          <p className="opacity-90">{park.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {souvenirs.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-xl font-medium mb-2">No souvenirs found</h2>
            <p className="text-muted-foreground">
              We are adding new items soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {souvenirs.map((item: TSouvenir) => {
              const img = item.images?.[0]?.image;
              const price = Number(item.price || 0);
              return (
                <Link key={item.id} href={`/souvenirs/${item.slug || item.id}`}>
                  <Card className="overflow-hidden p-0 group hover:shadow-lg transition-shadow">
                    <div className={cn("relative h-56 w-full bg-muted")}>
                      {img?.original_url ? (
                        <Image
                          src={img.original_url}
                          alt={img.alt_text || item.name}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        {park.name}
                      </div>
                      <div className="font-medium line-clamp-2 min-h-[2.5rem]">
                        {item.name}
                      </div>
                      <Separator className="my-3" />
                      <div className="text-primary font-semibold">
                        ₹{price.toLocaleString("en-IN")}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
