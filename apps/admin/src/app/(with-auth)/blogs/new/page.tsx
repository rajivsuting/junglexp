import { Suspense } from "react";

import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import { BlogForm } from "@/features/blogs/components/blog-form";

export const metadata = {
  title: "Create Blog",
};

export default function CreateBlogPage() {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <BlogForm pageTitle="Create New Blog" />
        </Suspense>
      </div>
    </PageContainer>
  );
}
