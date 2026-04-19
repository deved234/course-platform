import Link from "next/link";

function StarDisplay({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array(fullStars).fill("⭐").join("").split("").map((_, i) => (
        <span key={`full-${i}`}>⭐</span>
      ))}
      {hasHalf && <span>✨</span>}
      {Array(emptyStars).fill("☆").join("").split("").map((_, i) => (
        <span key={`empty-${i}`}>☆</span>
      ))}
    </div>
  );
}

export default function CourseCard({ course }) {
  const id = course._id;
  const instructorName = course.instructor?.name ?? "—";
  const rating = typeof course.averageRating === "number" ? course.averageRating : 0;
  const hasRatings = course.ratings && course.ratings.length > 0;

  return (
    <Link
      href={`/courses/${id}`}
      className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-violet-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-violet-700"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-transparent to-purple-500/0 group-hover:from-violet-500/5 group-hover:via-transparent group-hover:to-purple-500/5 transition-all duration-300" />

      <div className="relative p-5 space-y-3">
        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-block rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:from-violet-950 dark:to-purple-950 dark:text-violet-300">
            {course.category}
          </span>
          {hasRatings && (
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {course.ratings.length} rating{course.ratings.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300 line-clamp-2">
          {course.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarDisplay rating={rating} />
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {rating > 0 ? rating.toFixed(1) : "Not rated"}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
            <span>👨‍🏫</span>
            <span className="font-medium truncate">{instructorName}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}
