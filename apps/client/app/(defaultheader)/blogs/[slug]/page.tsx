import BlogDetails from "@/screens/blogs-page/blog-details";
import { getAllBlogsSlugs, getBlogBySlug } from "@repo/actions/blogs.actions";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import RelatedBlogs from "./RelatedBlogs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Metadata } from "next/types";

export async function generateStaticParams() {
  const blogs = await getAllBlogsSlugs();

  return blogs;
}

export const dynamicParams = true;
export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.content.substring(0, 160).replace(/<[^>]*>?/gm, ""),
    openGraph: {
      title: blog.title,
      description: blog.content.substring(0, 160).replace(/<[^>]*>?/gm, ""),
      images: blog.thumbnail?.small_url,
    },
  };
}

export default async function Page({ params }: PageProps<"/blogs/[slug]">) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <>
      <BlogDetails blog={blog} />
      <Suspense
        fallback={
          <div className="max-w-4xl px-4 py-16 sm:px-6 lg:px-8 mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-light text-primary">
                Related Blogs
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
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
        }
      >
        <RelatedBlogs categoryId={blog.category.id} excludeBlogId={blog.id} />
      </Suspense>
    </>
  );
}
