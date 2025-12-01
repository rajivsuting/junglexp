import { Suspense } from "react";
import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import { BlogForm } from "@/features/blogs/components/blog-form";
import { getBlogCategories } from "@repo/actions/blog-categories.actions";

export const metadata = {
  title: "Create Blog",
};

export default async function CreateBlogPage() {
  const categories = await getBlogCategories();

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <BlogForm pageTitle="Create New Blog" categories={categories} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
