import { notFound } from "next/navigation";
import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import { BlogForm } from "@/features/blogs/components/blog-form";
import { getBlogById } from "@repo/actions/blogs.actions";
import { getBlogCategories } from "@repo/actions/blog-categories.actions";

export const metadata = {
  title: "Edit Blog",
};

type PageProps = {
  params: Promise<{ blogId: string }>;
};

export default async function EditBlogPage({ params }: PageProps) {
  const { blogId } = await params;
  const id = parseInt(blogId);

  if (isNaN(id)) {
    notFound();
  }

  const [blog, categories] = await Promise.all([
    getBlogById(id),
    getBlogCategories(),
  ]);

  if (!blog) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <BlogForm
            pageTitle="Edit Blog"
            initialData={blog as any}
            categories={categories}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
