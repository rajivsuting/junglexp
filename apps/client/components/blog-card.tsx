import Image from "next/image";
import Link from "next/link";
import type { TBlog, TBlogCategory } from "@repo/db/index";
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
  category: TBlogCategory;
};

interface BlogCardProps {
  blog: BlogWithThumbnail;
}

export function BlogCard({ blog }: BlogCardProps) {
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
    <Link href={`/blogs/${blog.slug}`} className="group">
      <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col border border-border/30">
        <div className="relative aspect-video w-full overflow-hidden">
          {blog.thumbnail ? (
            <Image
              src={blog.thumbnail.medium_url || blog.thumbnail.original_url}
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
              {blog.category.name}
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
  );
}

