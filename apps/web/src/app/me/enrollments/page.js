import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default async function MeEnrollmentsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cp_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const { data, error } = await apiFetch("/enrollments/me?page=1&limit=20", { token });

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        <span className="font-semibold">⚠️ Error:</span> {error}
      </div>
    );
  }

  const items = data?.items ?? [];
  const total = data?.pagination?.total ?? items.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">📚 My Courses</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Track your learning progress and continue your courses
        </p>
      </div>

      {/* Stats */}
      <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-violet-50 to-purple-50 p-6 dark:border-zinc-800 dark:from-violet-950/20 dark:to-purple-950/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Courses</p>
            <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{total}</p>
          </div>
          <div className="text-5xl">🎯</div>
        </div>
      </div>

      {/* Courses List */}
      {items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">No enrolled courses yet</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            Start learning by enrolling in a course
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:from-violet-700 hover:to-purple-700 transition-all shadow-md"
          >
            🎓 Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {items.map((enrollment) => {
            const course = enrollment.course;
            const courseId = course?._id ?? enrollment.course;
            const title = course?.title ?? "Course";
            const progress = enrollment.progressPercent ?? 0;
            const isCompleted = progress >= 100;

            return (
              <Link
                key={enrollment._id}
                href={`/courses/${courseId}`}
                className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-violet-300 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-violet-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-violet-600 dark:text-zinc-50 dark:group-hover:text-violet-400 transition-colors truncate">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {course?.category && <span>Category: {course.category}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isCompleted && (
                      <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 dark:bg-emerald-950/30">
                        <span>✅</span>
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Completed</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Progress</span>
                    <span className="font-semibold text-violet-600 dark:text-violet-400">{progress}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-zinc-200 overflow-hidden dark:bg-zinc-800">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Action */}
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Continue Learning →
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
