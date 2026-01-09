import { notFound } from "next/navigation";

import StayDetails from "@/screens/stays-page";
import {
  getAllHotelsSlugs,
  getHotelBySlug,
} from "@repo/actions/hotels.actions";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;
export const dynamic = "force-static";
export const revalidate = 86400;

export const generateMetadata = async ({ params }: PageProps) => {
  const { slug } = await params;
  const stay = await getHotelBySlug(slug);
  if (!stay) return notFound();

  return {
    title: stay.name,
    description: stay.description,
    openGraph: {
      title: stay.name,
      description: stay.description,
      images: stay.images.map((image) => image.image?.small_url),
    },
  };
};

export async function generateStaticParams() {
  const stays = await getAllHotelsSlugs();
  return stays.map((stay) => ({ slug: stay }));
}

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stay = await getHotelBySlug(slug);

  if (!stay) {
    notFound();
  }

  return <StayDetails stay={stay as any} />;
}
