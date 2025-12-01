import Image from "next/image";
import Link from "next/link";
import type { TBlog, TBlogCategory } from "@repo/db/index";
import { calculateReadTime } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/blog-card";

type BlogWithThumbnail = TBlog & {
  thumbnail: {
    small_url: string;
    medium_url: string;
    large_url: string;
    original_url: string;
    alt_text: string;
  } | null;
  category: TBlogCategory;
};

interface BlogsPageProps {
  blogs: BlogWithThumbnail[];
  totalPages: number;
  currentPage: number;
}

export default function BlogsPage({
  blogs,
  totalPages,
  currentPage,
}: BlogsPageProps) {
  return (
    <div className="text-primary font-sans min-h-screen">
      {/* Header Section matching Home Page style */}
      <section className="relative py-20 flex items-center justify-center bg-[#2F2F2F] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          {/* Optional: Add a background pattern or image here if desired, similar to home page hero but simpler */}
        </div>
        <div className="relative z-10 text-center px-4">
          <p className="text-sm md:text-[16px] font-light mb-4 tracking-widest">
            DISCOVER . EXPLORE . READ
          </p>
          <h1 className="text-4xl md:text-6xl font-light">
            <span className="font-bold">JUNGLEXP</span> BLOGS
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-light text-primary">Latest Articles</h2>
        </div>
        {blogs.length === 0 ? (
          <div className="text-center text-primary/60 py-12 text-lg font-light">
            No blogs found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
