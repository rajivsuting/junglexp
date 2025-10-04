import { notFound } from "next/navigation";

import ActivityDetails from "@/screens/activities-page";
import {
  getActivities,
  getActivityBySlug,
} from "@repo/actions/activities.actions";
import { getNationalParkBySlug } from "@repo/actions/parks.actions";

type PageProps = {
  params: Promise<{ "park-id": string; "activity-slug": string }>;
};

export const generateMetadata = async ({ params }: PageProps) => {
  const { "activity-slug": activitySlug } = await params;
  const activity = await getActivityBySlug(activitySlug);
  return {
    title: activity?.name,
    description: activity?.description,
    openGraph: {
      title: activity?.name,
      description: activity?.description,
      images: activity?.images.map((image) => image.image?.small_url),
    },
  };
};

export const generateStaticParams = async () => {
  const { activities } = await getActivities({});
  return activities.map((activity) => ({
    "park-id": activity.park.slug,
    "activity-slug": activity.slug,
  }));
};

export default async function ActivitiesPage({ params }: PageProps) {
  const { "park-id": parkId, "activity-slug": activitySlug } = await params;

  if (!parkId || !activitySlug) {
    notFound();
  }

  const activity = await getActivityBySlug(activitySlug);

  if (!activity) {
    notFound();
  }

  return <ActivityDetails activity={activity as any} />;
}
