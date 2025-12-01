import { PlayCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import ForestStaysSection from "@/components/ForestStaysSection";
import ImageSlideshow from "@/components/ImageSlideshow";
import LodgesSection from "@/components/LodgesSection";
import Map from "@/components/Map";
import { SafariSection } from "@/components/safari-section";
import { getNationalParkBySlug } from "@repo/actions/parks.actions";
import { getConfiguration } from "@repo/actions/configurations.actions";

export const generateMetadata = async () => {
  const park = await getNationalParkBySlug("jim-corbet-national-park");

  return {
    title: park?.name,
    description: park?.description,
    openGraph: {
      title: park?.name,
      description: park?.description,
      images: park?.images.map((image) => image.image.small_url),
    },
  };
};

export default async function HomePage() {
  const [park, homePageTitleConfig] = await Promise.all([
    getNationalParkBySlug("jim-corbet-national-park"),
    getConfiguration("home_page_title"),
  ]);

  if (!park) {
    return null;
  }

  const homePageTitle = homePageTitleConfig?.value || (
    <span>
      Plan Your Next
      <br />
      Safari to <span className="font-bold">Jim Corbett</span>
      <br />
      National Park
    </span>
  );

  return (
    <div className="bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[90dvh] flex items-center justify-start overflow-hidden">
        {/* <Image
          src="/a-rugged-open-top-safari-jeep-with-tourists-wearin.png"
          alt="Elephants drinking in Pan in Jim Corbett"
          fill
          priority
          className="object-cover object-center absolute inset-0 z-0"
        /> */}
        <ImageSlideshow
          mobileImages={park?.mobile_images?.map((image) => image.image) || []}
          images={park?.images.map((image) => image.image) || []}
        />
        <div className="relative grid grid-cols-1 z-10 mx-4 sm:mx-6 lg:mx-24">
          <p className="text-sm md:text-[16px] font-light mb-4 text-white">
            DISCOVER . EXPLORE . EXPERIENCE
          </p>
          <div className="text-[32px] md:text-[62px] font-light mb-6 w-full md:leading-18 text-white drop-shadow">
            {typeof homePageTitle === "string" ? (
              <span dangerouslySetInnerHTML={{ __html: homePageTitle }} />
            ) : (
              homePageTitle
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/parks/jim-corbet-national-park/stays?stay-type=resort"
              className="px-6 py-2 border-2 w-fit border-white text-white text-base font-medium hover:bg-white hover:text-black transition-colors"
            >
              Find Lodges
            </Link>
          </div>
        </div>
        {/* Animated Play Button */}
        <Link href="/reels" className="group absolute right-6 bottom-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Outer circle - largest with animation */}
            <div className="absolute w-24 h-24 border-25 border-white rounded-full opacity-30 animate-ping animation-delay-1000"></div>

            {/* Middle circle with different animation */}
            <div className="absolute w-20 h-20 border-2 border-white rounded-full opacity-50 animate-pulse animation-delay-500"></div>

            {/* Inner circle with ping animation */}
            <div className="absolute w-16 h-16 border-3 border-white rounded-full opacity-70 animate-ping"></div>

            {/* Play button core */}
            <PlayCircle className="w-12 h-12 text-white" />
          </div>
        </Link>
      </section>

      {/* Main Hwange Information Section */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-primary text-3xl font-light mb-8">
            <span className="font-bold">JIM CORBETT</span> NATIONAL PARK
          </h1>

          <div className="space-y-6 text-primary font-light">
            {park?.description.split("\n").map((line, index) => (
              <p key={index} className="text-lg max-w-4xl mx-auto">
                {line}
              </p>
            ))}

            {/* <div className="pt-8">
              <div className="w-72 h-[1px] bg-[#9B8B6C] mx-auto"></div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Quick Navigation Links */}
      <section className="w-ful flex flex-row bg-[#F5F0E6]">
        <div className="flex flex-1 flex-col md:flex-row">
          <div className="flex-1 flex h-full overflow-auto">
            <video
              autoPlay
              loop
              controls={false}
              muted
              playsInline={true}
              webkit-playsinline="true"
              x-webkit-airplay="allow"
              preload="metadata"
              disablePictureInPicture
              className="flex-1 flex aspect-square object-cover"
              src="https://ik.imagekit.io/ovrrfvjgl/20230612_150614.mp4?updatedAt=1760256546804"
              // src="https://video.wixstatic.com/video/5265be_ef0152dfff594d299e5363f2742b4853/720p/mp4/file.mp4"
            />
          </div>
          <div className="max-w-4xl py-32 flex-1 mx-auto px-10">
            <h2 className="text-2xl font-mono font-bold text-center mb-12 text-[#9B8B6C]">
              QUICK NAVIGATION LINKS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
              {[
                {
                  title: "RESORT STAYS",
                  href: `/parks/${park.slug}/stays?stay-type=resort`,
                  color: "bg-[#6B705C]",
                },
                {
                  title: "FOREST STAYS",
                  href: `/parks/${park.slug}/stays?stay-type=forest`,
                  color: "bg-[#A5A58D]",
                },
                {
                  title: "SAFARIS & ACTIVITIES",
                  href: `/parks/${park.slug}/activities`,
                  color: "bg-[#2F2F2F]",
                },
              ].map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  className="group flex flex-col items-center gap-4"
                >
                  <div
                    className={`lg:w-32 lg:h-32 w-24 h-24 rounded-full ${link.color} relative flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <div className="lg:w-24 lg:h-24 w-18 h-18  rounded-full border-2 border-[#F5F0E6] opacity-60"></div>
                    <div className="w-10 h-10 lg:w-16 lg:h-16  rounded-full border-2 border-[#F5F0E6] opacity-40 absolute"></div>
                  </div>
                  <span className="text-[#877B4E] text-center font-bold text-sm">
                    {link.title}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex-1 flex h-full aspect-square overflow-auto">
            <video
              autoPlay
              loop
              controls={false}
              playsInline={true}
              webkit-playsinline="true"
              x-webkit-airplay="allow"
              preload="metadata"
              disablePictureInPicture
              muted
              className="flex flex-1 object-cover"
              src="https://ik.imagekit.io/ovrrfvjgl/VID20250129074022.mp4?updatedAt=1760256560333"

              // src="https://video.wixstatic.com/video/5265be_a0ccfaab6d554b358651c0877c8f5ffd/720p/mp4/file.mp4"
            />
          </div>
        </div>
      </section>

      <Suspense>
        <SafariSection park={park as any} />
      </Suspense>

      <div className="w-72 h-[1px] bg-[#9B8B6C] mx-auto"></div>

      {/* Lodges Section */}
      {/* <Suspense>
        <LodgesSection park={park as any} />
      </Suspense>
      <div className="w-72 h-[1px] bg-[#9B8B6C] mx-auto"></div>
      <Suspense>
        <ForestStaysSection park={park as any} />
      </Suspense> */}

      {/* Map Section (Placeholder) */}
      <Map />
      {/* <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
            Map of Jim Corbett National Park
          </h2>
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            [Map Placeholder]
          </div>
        </div>
      </section> */}

      {/* Decorative Divider */}
      <div className="w-72 h-[1px] bg-[#9B8B6C] mx-auto"></div>

      {/* Reviews Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-[#9B8B6C] text-3xl font-light mb-8">
            <span className="font-bold">JIM CORBETT NATIONAL PARK</span> REVIEWS
          </h2>

          <ReviewsSection />
        </div>
      </section> */}
    </div>
  );
}
