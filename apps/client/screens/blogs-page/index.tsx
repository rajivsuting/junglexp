import Image from "next/image";
import Link from "next/link";
import type { TBlog } from "@repo/db/index";
import { calculateReadTime } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type BlogWithThumbnail = TBlog & {
  thumbnail: {
    small_url: string;
    medium_url: string;
    large_url: string;
    original_url: string;
    alt_text: string;
  } | null;
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
  const getExcerpt = (content: string) => {
    try {
      // Try parsing as Lexical JSON
      const parsed = JSON.parse(content);
      if (parsed.root && parsed.root.children) {
        // Simple extraction of text from the first few nodes
        let text = "";
        const traverse = (node: any) => {
          if (text.length > 200) return; // Limit length
          if (node.text) {
            text += node.text + " ";
          }
          if (node.children) {
            node.children.forEach(traverse);
          }
        };
        traverse(parsed.root);
        return text;
      }
    } catch (e) {
      // If JSON parse fails, assume it's HTML or plain text
      return content.replace(/<[^>]*>?/gm, "");
    }
    return "";
  };

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
              <Link
                href={`/blogs/${blog.slug}`}
                key={blog.id}
                className="group"
              >
                <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col border border-border/30">
                  <div className="relative aspect-video w-full overflow-hidden">
                    {blog.thumbnail ? (
                      <Image
                        src={
                          blog.thumbnail.medium_url ||
                          blog.thumbnail.original_url
                        }
                        alt={blog.thumbnail.alt_text || blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-primary shadow-sm">
                        ARTICLE
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <span>
                        {new Date(blog.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      <span>{calculateReadTime(blog.content)} min read</span>
                    </div>
                    <h2 className="text-xl font-light mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {blog.title}
                    </h2>
                    <div className="text-muted-foreground line-clamp-3 text-sm font-light leading-relaxed mb-6">
                      {getExcerpt(blog.content)}
                    </div>
                    <div className="mt-auto pt-2">
                      <div className="text-xs font-bold group-hover:text-primary uppercase tracking-wider flex items-center gap-2 transition-colors">
                        READ MORE{" "}
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
