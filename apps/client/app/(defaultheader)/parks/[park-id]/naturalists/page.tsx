import { Briefcase, MapPin, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getNaturalists } from "@repo/actions/naturlists.actions";
import { getNationalParkBySlug } from "@repo/actions/parks.actions";

type Props = {
  params: Promise<{ "park-id": string }>;
};

export const generateMetadata = async ({ params }: Props) => {
  const { "park-id": parkSlug } = await params;
  const park = await getNationalParkBySlug(parkSlug);
  if (!park) return notFound();
  return {
    title: `${park.name} Naturalists`,
    description: `${park.name} offers a full range of accommodation options from simple camps to some of the most sought after luxury lodges in the region.`,
    openGraph: {
      title: `${park.name} Naturalists`,
      description: `${park.name} offers a full range of accommodation options from simple camps to some of the most sought after luxury lodges in the region.`,
      images: park.images.map((image) => image.image?.small_url),
    },
  };
};

export default async function NaturalistsPage({ params }: Props) {
  const { "park-id": parkSlug } = await params;

  const park = await getNationalParkBySlug(parkSlug);

  if (!park) return ""; // notFound()

  const { naturalists } = await getNaturalists({ park_ids: [park.id] });

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-16 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Expert Naturalists</h1>
          </div>
          <div className="flex items-center gap-2 text-primary-foreground/90">
            <MapPin className="w-4 h-4" />
            <p className="text-lg">{park.name}</p>
          </div>
          <p className="mt-3 text-primary-foreground/80 max-w-2xl">
            Connect with our experienced naturalists who will guide you through
            the wilderness
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {naturalists.length === 0 ? (
          <div className="text-center py-16">
            <User className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No Naturalists Available
            </h2>
            <p className="text-muted-foreground">
              There are currently no naturalists listed for this park.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {naturalists.map((n: any) => {
              const activitiesCount = n.naturalistActivities?.length || 0;
              return (
                <article
                  key={n.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ring-1 ring-gray-200 hover:ring-primary/50 overflow-hidden"
                >
                  {/* Header gradient */}
                  <div className="h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent)]" />
                  </div>

                  {/* Profile Image */}
                  <div className="-mt-14 flex justify-center">
                    <div className="relative h-28 w-28 rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                      {n.image ? (
                        <Image
                          src={n.image.small_url}
                          alt={n.image.alt_text || n.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <User className="w-12 h-12 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-6 pb-6 pt-4">
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        {n.name}
                      </h2>

                      {/* Activities Badge */}
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                            activitiesCount === 0
                              ? "bg-gray-100 text-gray-600"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          {activitiesCount === 0 ? (
                            <span>No activities</span>
                          ) : activitiesCount === 1 ? (
                            <span>1 activity</span>
                          ) : (
                            <span>{activitiesCount} activities</span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-5">
                        {n.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Link
                          href={`/naturalist/${n.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-white text-sm font-semibold hover:bg-primary/90 transition-colors duration-200 shadow-sm hover:shadow-md w-full"
                        >
                          <User className="w-4 h-4" />
                          View Profile
                        </Link>
                        {/* <Link
                          href={`/contact?subject=Enquiry%20for%20Naturalist%20${encodeURIComponent(
                            n.name
                          )}`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary text-primary px-5 py-2.5 text-sm font-semibold hover:bg-primary/10 transition-colors duration-200 w-full"
                        >
                          Enquire Now
                        </Link> */}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
