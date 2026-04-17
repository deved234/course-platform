import Link from "next/link";

export default function CourseCard({ course }) {
  const id = course._id;
  const instructorName = course.instructor?.name ?? "—";
  const rating =
    typeof course.averageRating === "number" ? course.averageRating.toFixed(1) : "—";

  return (
    <Link
      href={`/courses/${id}`}
      className="block rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
    >
      <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">{course.title}</h2>
      <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{course.description}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-500">
        <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-900">{course.category}</span>
        <span>Rating {rating}</span>
        <span>Instructor: {instructorName}</span>
      </div>
    </Link>
  );
}
