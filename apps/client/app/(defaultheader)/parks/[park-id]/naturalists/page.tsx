import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { getNaturalists } from '@repo/actions/naturlists.actions';
import { getNationalParkBySlug } from '@repo/actions/parks.actions';

type Props = {
  params: Promise<{ "park-id": string }>;
};

export default async function NaturalistsPage({ params }: Props) {
  const { "park-id": parkSlug } = await params;

  const park = await getNationalParkBySlug(parkSlug);

  if (!park) return notFound();

  const { naturalists } = await getNaturalists({ park_ids: [park.id] });

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-semibold">Naturalists</h1>
          <p className="opacity-90">{park.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {naturalists.map((n: any) => (
            <article
              key={n.id}
              className="bg-white rounded-xl shadow-sm ring-1 ring-border overflow-hidden"
            >
              <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/5" />
              <div className="-mt-10 flex justify-center">
                <div className="relative h-20 w-20 rounded-full ring-4 ring-white overflow-hidden">
                  {n.image ? (
                    <Image
                      src={n.image.small_url}
                      alt={n.image.alt_text || n.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 text-center">
                <h2 className="text-lg font-semibold text-foreground">
                  {n.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {n.description}
                </p>
                <div className="mt-5">
                  <Link
                    href={`/contact?subject=Enquiry%20for%20Naturalist%20${encodeURIComponent(
                      n.name
                    )}`}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-white text-sm font-medium hover:opacity-90"
                  >
                    Enquire
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
