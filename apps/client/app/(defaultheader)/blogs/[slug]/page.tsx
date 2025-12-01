import BlogDetails from "@/screens/blogs-page/blog-details";
import { getAllBlogsSlugs, getBlogBySlug } from "@repo/actions/blogs.actions";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogs = await getAllBlogsSlugs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: PageProps) {
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
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return <BlogDetails blog={blog} />;
}
