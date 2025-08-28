import { notFound } from "next/navigation";

import StayDetails from "@/screens/stays-page";
import { getHotelBySlug } from "@repo/actions/hotels.actions";

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stay = await getHotelBySlug(slug);

  console.log("stay", stay);

  if (!stay) {
    notFound();
  }

  return <StayDetails stay={stay} />;
}
