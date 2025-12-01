import Image from "next/image";
import type { TBlog, TBlogCategory } from "@repo/db/index";
import { LexicalRenderer } from "@/components/lexical-renderer";
import { calculateReadTime } from "@/lib/utils";
import Link from "next/link";

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

interface BlogDetailsProps {
  blog: BlogWithThumbnail;
}

export default function BlogDetails({ blog }: BlogDetailsProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 font-sans min-h-screen">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav
          className={`mb-8 flex items-center gap-2 text-xs md:text-sm text-primary/60 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 no-scrollbar`}
        >
          <Link className="hover:text-primary flex-shrink-0" href="/">
            Home
          </Link>
          <span className="flex-shrink-0">/</span>
          <Link className="hover:text-primary flex-shrink-0" href="/blogs">
            Blogs
          </Link>
          <span className="flex-shrink-0">/</span>
          <span className="text-primary font-medium truncate max-w-[150px] md:max-w-none">
            {blog.title}
          </span>
        </nav>

        {/* Category Badge */}
        <div className="mb-4">
          <span
            className={`inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary`}
          >
            {blog.category.name}
          </span>
        </div>

        {/* Title */}
        <h1
          className={`mb-6 text-2xl font-light leading-tight text-primary md:text-3xl lg:text-4xl`}
        >
          {blog.title}
        </h1>

        {/* Meta Info */}
        <div
          className={`mb-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-primary/20 pb-6 text-xs md:text-sm text-primary/70`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">By</span>
            <span>Junglexp Team</span>
          </div>
          <span className="hidden md:inline">•</span>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span>
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{calculateReadTime(blog.content)} min read</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {blog.thumbnail && (
        <div className="w-full mx-auto mb-16">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl shadow-sm">
            <Image
              src={blog.thumbnail.large_url || blog.thumbnail.original_url}
              alt={blog.thumbnail.alt_text || blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mx-auto">
        <div className="prose prose-lg prose-stone max-w-none mx-auto prose-headings:font-light prose-headings:text-primary prose-p:text-primary/80 prose-p:leading-relaxed prose-p:font-light prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-strong:font-bold prose-strong:text-primary prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic">
          <LexicalRenderer content={blog.content} />
        </div>
      </div>
    </article>
  );
}
