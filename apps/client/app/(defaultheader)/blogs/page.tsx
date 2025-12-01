import BlogsPage from "@/screens/blogs-page";
import { getBlogs } from "@repo/actions/blogs.actions";

export const metadata = {
  title: "Our Blog",
  description: "Read our latest stories and updates.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1;

  const { data, totalPages } = await getBlogs({
    page,
  });

  return <BlogsPage blogs={data} totalPages={totalPages} currentPage={page} />;
}
