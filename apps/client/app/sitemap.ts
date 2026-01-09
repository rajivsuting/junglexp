import type { MetadataRoute } from "next";
import { getNationalParks } from "@repo/actions/parks.actions";
import { getActivities } from "@repo/actions/activities.actions";
import { getAllBlogsSlugs } from "@repo/actions/blogs.actions";
import { getAllHotelsSlugs } from "@repo/actions/hotels.actions";
import { getNaturalistsIds } from "@repo/actions/naturlists.actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [parksData, activitiesData, blogSlugs, hotelSlugs, naturalistsIds] =
    await Promise.all([
      getNationalParks(),
      getActivities({}), // Fetch all activities
      getAllBlogsSlugs(),
      getAllHotelsSlugs(),
      getNaturalistsIds(),
    ]);

  const lastModified = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://junglexp.in",
      lastModified,
      changeFrequency: "daily" as "daily",
      priority: 1,
      images: ["https://junglexp.in/tiger-heroi.jpg"],
    },
    {
      url: "https://junglexp.in/contact-us",
      lastModified,
      changeFrequency: "monthly" as "monthly",
      priority: 0.8,
      images: ["https://junglexp.in/tiger-heroi.jpg"],
    },
    {
      url: "https://junglexp.in/blogs",
      lastModified,
      changeFrequency: "weekly" as "weekly",
      priority: 0.8,
      images: ["https://junglexp.in/tiger-heroi.jpg"],
    },
    {
      url: "https://junglexp.in/terms-and-conditions",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
      images: ["https://junglexp.in/tiger-heroi.jpg"],
    },
  ];

  const parkRoutes: MetadataRoute.Sitemap = parksData.parks.map((park) => ({
    url: `https://junglexp.in/parks/${park.slug}`,
    lastModified,
    changeFrequency: "daily",
    priority: 0.9,
    images:
      park.images.length > 0 ? [park.images[0].image?.original_url || ""] : [],
  }));

  const naturalistsRoutes: MetadataRoute.Sitemap = naturalistsIds.map(
    (naturalistId) => ({
      url: `https://junglexp.in/naturalists/${naturalistId}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const naturalistByParkRoutes: MetadataRoute.Sitemap = parksData.parks.map(
    (park) => ({
      url: `https://junglexp.in/parks/${park.slug}/naturalists`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const activityRoutes: MetadataRoute.Sitemap = activitiesData.activities.map(
    (activity) => ({
      url: `https://junglexp.in/parks/${activity.park?.slug}/activities/${activity.slug}`,
      lastModified,
      changeFrequency: "weekly" as "weekly",
      priority: 0.7,
      images:
        activity.images.length > 0
          ? [activity.images[0].image?.original_url || ""]
          : [],
    })
  );

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((blog) => ({
    url: `https://junglexp.in/blogs/${blog.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const hotelRoutes: MetadataRoute.Sitemap = hotelSlugs.map((hotelSlug) => ({
    url: `https://junglexp.in/stays/${hotelSlug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const reelsRoutes: MetadataRoute.Sitemap = [
    {
      url: "https://junglexp.in/reels",
      lastModified,
      changeFrequency: "weekly" as "weekly",
      priority: 0.7,
    },
  ];

  return [
    ...staticPages,
    ...parkRoutes,
    ...activityRoutes,
    ...blogRoutes,
    ...hotelRoutes,
    ...reelsRoutes,
    ...naturalistsRoutes,
    ...naturalistByParkRoutes,
  ];
}
