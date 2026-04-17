import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Online course platform</h1>
      <p className="max-w-xl text-zinc-600 dark:text-zinc-400">
         frontend for the REST API: auth with roles, courses (search and filters), lessons, enrollments,
        ratings, progress, and comments.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/courses"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Browse courses
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
