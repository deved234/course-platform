import Link from "next/link";
import { apiFetch } from "@/lib/api";
import CourseCard from "@/components/CourseCard";

export default async function CoursesPage(props) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.limit) || 10));
  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : "";
  const sortBy =
    searchParams.sortBy === "oldest" || searchParams.sortBy === "rating"
      ? searchParams.sortBy
      : "newest";

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (search) qs.set("search", search);
  if (category) qs.set("category", category);
  qs.set("sortBy", sortBy);

  const { data, error } = await apiFetch(`/courses?${qs.toString()}`);

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }

  const items = data?.items ?? [];
  const pagination = data?.pagination ?? { total: 0, page: 1, limit, totalPages: 1 };
  const totalPages = Math.max(1, pagination.totalPages || 1);

  const linkForPage = (p) => {
    const q = new URLSearchParams();
    q.set("page", String(p));
    q.set("limit", String(limit));
    if (search) q.set("search", search);
    if (category) q.set("category", category);
    q.set("sortBy", sortBy);
    return `/courses?${q.toString()}`;
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Courses</h1>
      <form action="/courses" method="get" className="mt-4 flex flex-wrap items-end gap-3">
        <input type="hidden" name="page" value="1" />
        <input type="hidden" name="limit" value={String(limit)} />
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Search</label>
          <input
            name="search"
            defaultValue={search}
            placeholder="Keyword"
            className="mt-1 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Category</label>
          <input
            name="category"
            defaultValue={category}
            placeholder="e.g. Backend"
            className="mt-1 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Sort</label>
          <select
            name="sortBy"
            defaultValue={sortBy}
            className="mt-1 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Apply
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        {pagination.total} course{pagination.total === 1 ? "" : "s"} · Page {pagination.page} of{" "}
        {totalPages}
      </p>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((course) => (
          <li key={course._id}>
            <CourseCard course={course} />
          </li>
        ))}
      </ul>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">No courses match your filters.</p>
      ) : null}

      <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
        {page > 1 ? (
          <Link
            href={linkForPage(page - 1)}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-900"
          >
            Previous
          </Link>
        ) : (
          <span className="text-sm text-zinc-400">Previous</span>
        )}
        {page < totalPages ? (
          <Link
            href={linkForPage(page + 1)}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-900"
          >
            Next
          </Link>
        ) : (
          <span className="text-sm text-zinc-400">Next</span>
        )}
      </div>
    </div>
  );
}
