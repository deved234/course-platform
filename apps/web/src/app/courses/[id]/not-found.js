import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3 py-8">
      <h1 className="text-lg font-semibold">Course not found</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">This course does not exist or was removed.</p>
      <Link href="/courses" className="text-sm font-medium underline">
        Back to courses
      </Link>
    </div>
  );
}
