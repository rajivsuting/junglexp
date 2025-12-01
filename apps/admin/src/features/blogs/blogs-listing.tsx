import { searchParamsCache } from '@/lib/searchparams';
import { getBlogs } from '@repo/actions/blogs.actions';

import { BlogsTable } from './components/blogs-table';
import { columns } from './components/blogs-table/columns';

const BlogsListing = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("title");
  const pageLimit = searchParamsCache.get("perPage");

  const { data, total } = await getBlogs({
    page,
    limit: pageLimit,
    search: search || "",
  });

  return (
    <BlogsTable
      data={data}
      totalItems={total}
      columns={columns}
    />
  );
};

export default BlogsListing;

