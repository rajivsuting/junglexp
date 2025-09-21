import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getSouvenirBySlug } from '@repo/actions/souvenirs.actions';

type PageProps = {
  params: Promise<{ "souvenir-id": string }>;
};

export default async function SouvenirDetailsPage(props: PageProps) {
  const params = await props.params;

  console.log("sd", params["souvenir-id"]);

  const souvenir = await getSouvenirBySlug(params["souvenir-id"]);
  if (!souvenir) return notFound();

  const images =
    souvenir.images?.sort(
      (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)
    ) || [];
  const mainImage = images[0]?.image;
  const otherImages = images
    .slice(1)
    .map((i: any) => i.image)
    .filter(Boolean);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{souvenir.name}</h1>
            <p className="opacity-90 text-sm">{souvenir.park?.name}</p>
          </div>
          <Link
            href={`/parks/${souvenir.park?.slug}/souvenirs`}
            className="underline text-sm"
          >
            Back to souvenirs
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div>
            <Card className="overflow-hidden p-0">
              <div
                className={cn(
                  "relative w-full bg-muted",
                  mainImage ? "aspect-[4/3]" : "h-72"
                )}
              >
                {mainImage ? (
                  <Image
                    src={mainImage.original_url}
                    alt={mainImage.alt_text || souvenir.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>
              {otherImages.length > 0 ? (
                <CardContent className="p-3">
                  <div className="grid grid-cols-4 gap-2">
                    {otherImages.slice(0, 8).map((img: any) => (
                      <div
                        key={img.id}
                        className="relative aspect-square rounded-md overflow-hidden bg-muted"
                      >
                        <Image
                          src={img.small_url || img.original_url}
                          alt={img.alt_text || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              ) : null}
            </Card>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {souvenir.is_available ? (
                <Badge className="bg-green-600 hover:bg-green-600/90">
                  In stock
                </Badge>
              ) : (
                <Badge variant="secondary">Out of stock</Badge>
              )}
              <span className="text-sm text-muted-foreground">
                SKU: {souvenir.id}
              </span>
            </div>

            <h2 className="text-2xl font-semibold mb-2">{souvenir.name}</h2>
            <div className="text-2xl font-bold text-primary mb-4">
              ₹{Number(souvenir.price || 0).toLocaleString("en-IN")}
            </div>

            <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-6">
              {souvenir.description}
            </p>

            <div className="flex items-center gap-3">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:opacity-90"
                disabled={!souvenir.is_available}
              >
                Enquire Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
