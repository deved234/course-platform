import Link from "next/link";
import { apiFetch } from "@/lib/api";
import CourseCard from "@/components/CourseCard";

export default async function CoursesPage(props) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.limit) || 12));
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
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        <p className="flex items-center gap-2">
          <span className="text-lg">❌</span>
          <span>{error}</span>
        </p>
      </div>
    );
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          📚 Explore Courses
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Find and enroll in courses that match your learning goals
        </p>
      </div>

      {/* Filter Form */}
      <form action="/courses" method="get" className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-white">Search & Filter</h2>
        <input type="hidden" name="page" value="1" />
        <input type="hidden" name="limit" value={String(limit)} />
        
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              🔍 Search
            </label>
            <input
              name="search"
              defaultValue={search}
              placeholder="Course name..."
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm placeholder-zinc-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:placeholder-zinc-400 transition-all"
            />
          </div>

          {/* Category Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              🏷️ Category
            </label>
            <input
              name="category"
              defaultValue={category}
              placeholder="e.g. Backend"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm placeholder-zinc-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:placeholder-zinc-400 transition-all"
            />
          </div>

          {/* Sort Select */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              📊 Sort
            </label>
            <select
              name="sortBy"
              defaultValue={sortBy}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-950 transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:from-violet-700 hover:to-purple-700 transition-all dark:from-violet-500 dark:to-purple-500"
            >
              🔎 Apply Filter
            </button>
          </div>
        </div>
      </form>

      {/* Stats */}
      <div className="rounded-lg border border-zinc-200 bg-gradient-to-r from-violet-50 to-purple-50 p-4 dark:border-zinc-800 dark:from-violet-950/20 dark:to-purple-950/20">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          📈 <span className="font-semibold">{pagination.total}</span> course{pagination.total !== 1 ? "s" : ""} found
          {pagination.totalPages > 1 && ` • Page ${pagination.page} of ${totalPages}`}
        </p>
      </div>

      {/* Course Grid */}
      {items.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="text-2xl mb-2">🎓</p>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            No courses match your filters
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-violet-700 hover:to-purple-700 transition-all"
          >
            Clear Filters → 
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((course) => (
            <li key={course._id}>
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          {/* First Page */}
          {page > 1 ? (
            <Link
              href={linkForPage(1)}
              className="rounded-lg border border-zinc-300 px-3.5 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              ⟨⟨ First
            </Link>
          ) : (
            <span className="rounded-lg border border-zinc-300 px-3.5 py-2 text-sm font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-600">
              ⟨⟨ First
            </span>
          )}

          {/* Previous Page */}
          {page > 1 ? (
            <Link
              href={linkForPage(page - 1)}
              className="rounded-lg border border-zinc-300 px-3.5 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              ⟨ Previous
            </Link>
          ) : (
            <span className="rounded-lg border border-zinc-300 px-3.5 py-2 text-sm font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-600">
              ⟨ Previous
            </span>
          )}

          {/* Page Info */}
          <div className="text-center">
            <span className="inline-block rounded-lg bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-900 dark:bg-violet-950/30 dark:text-violet-300">
              Page {page} of {totalPages}
            </span>
          </div>

          {/* Next Page */}
          {page < totalPages ? (
            <Link
              href={linkForPage(page + 1)}
              className="rounded-lg border border-zinc-300 px-3.5 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Next ⟩
            </Link>
          ) : (
            <span className="rounded-lg border border-zinc-300 px-3.5 py-2 text-sm font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-600">
              Next ⟩
            </span>
          )}

          {/* Last Page */}
          {page < totalPages ? (
            <Link
              href={linkForPage(totalPages)}
              className="rounded-lg border border-zinc-300 px-3.5 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Last ⟩⟩
            </Link>
          ) : (
            <span className="rounded-lg border border-zinc-300 px-3.5 py-2 text-sm font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-600">
              Last ⟩⟩
            </span>
          )}
        </div>
      )}
    </div>
  );
}
