import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="text-foreground font-sans min-h-screen">
      {/* Header Section matching Home Page style */}
      <section className="relative min-h-[60dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={"/blog-hero.jpg"}
            alt="Blogs Page Hero"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 bg-black/30"></div>
        <div className="relative z-10 text-center px-4 text-white">
          <p className="text-sm md:text-[16px] font-light mb-4 tracking-widest drop-shadow">
            DISCOVER . EXPLORE . READ
          </p>
          <h1 className="text-4xl md:text-6xl font-light drop-shadow">
            <span className="font-bold">JUNGLEXP</span> BLOGS
          </h1>
        </div>
      </section>

      {/* Blog List Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="h-full flex flex-col overflow-hidden border-none shadow-lg"
            >
              {/* Image Skeleton */}
              <Skeleton className="h-48 w-full rounded-none" />

              <CardContent className="flex-grow p-6">
                {/* Meta info (date/read time) */}
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>

                {/* Title */}
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-8 w-2/3 mb-4" />

                {/* Excerpt */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 mt-auto">
                <Skeleton className="h-10 w-32" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
