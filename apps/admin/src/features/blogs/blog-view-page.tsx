import { getBlogCategories } from "@repo/actions/blog-categories.actions";
import { BlogForm } from "./components/blog-form";
import { getBlogById } from "@repo/actions/blogs.actions";
import { notFound } from "next/navigation";

type BlogViewPageProps = {
  blogId: string;
};

export default async function BlogViewPage({ blogId }: BlogViewPageProps) {
  let blog = null;

  if (blogId !== "new") {
    const id = parseInt(blogId);
    if (isNaN(id)) {
      notFound();
    }
    blog = await getBlogById(id);
    if (!blog) {
      notFound();
    }
  }

  const categories = await getBlogCategories();

  return <BlogForm initialData={blog} categories={categories} />;
}
