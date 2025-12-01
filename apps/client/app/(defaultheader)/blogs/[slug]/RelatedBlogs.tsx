import { BlogCard } from "@/components/blog-card";
import { getRelatedBlogs } from "@repo/actions/blogs.actions";

export default async function RelatedBlogs({
  categoryId,
  excludeBlogId,
}: {
  categoryId: number;
  excludeBlogId: number;
}) {
  const relatedBlogs = await getRelatedBlogs({
    categoryId,
    excludeBlogId,
  });

  return (
    <div className="max-w-4xl px-4 py-16 sm:px-6 lg:px-8 mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl font-light text-primary">Related Blogs</h2>
      </div>
      {relatedBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedBlogs.map((relatedBlog) => (
            <BlogCard key={relatedBlog.id} blog={relatedBlog} />
          ))}
        </div>
      ) : (
        <div className="text-center text-primary/60 py-12 text-lg font-light">
          No related blogs found.
        </div>
      )}
    </div>
  );
}
