import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

export default async function InstructorDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cp_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const { data, error } = await apiFetch("/instructor/dashboard", { token });

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        <span className="font-semibold">Dashboard Error:</span> {error}
      </div>
    );
  }

  const summary = data?.summary ?? {
    totalCourses: 0,
    totalLessons: 0,
    totalEnrollments: 0,
    totalComments: 0,
    averageCourseRating: 0,
  };
  const items = data?.items ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            Instructor Dashboard
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Monitor your courses, student activity, and lesson engagement in one place.
          </p>
        </div>
        <Link
          href="/courses/new"
          className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Create New Course
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Courses"
          value={summary.totalCourses}
          accent="text-violet-600 dark:text-violet-400"
        />
        <StatCard
          label="Lessons"
          value={summary.totalLessons}
          accent="text-sky-600 dark:text-sky-400"
        />
        <StatCard
          label="Enrollments"
          value={summary.totalEnrollments}
          accent="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Comments"
          value={summary.totalComments}
          accent="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Avg Rating"
          value={summary.averageCourseRating}
          accent="text-fuchsia-600 dark:text-fuchsia-400"
        />
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            No instructor courses yet
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Create your first course to start tracking lessons and enrollments.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((course) => (
            <Link
              key={course._id}
              href={`/courses/${course._id}`}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-violet-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-violet-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/30 dark:text-violet-300">
                    {course.category}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-zinc-900 dark:text-white">
                    {course.title}
                  </h2>
                </div>
                <div className="text-right text-sm text-zinc-600 dark:text-zinc-400">
                  <p>{course.averageRating?.toFixed?.(1) ?? course.averageRating} rating</p>
                  <p>{course.ratings?.length ?? 0} ratings</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/60">
                  <p className="text-zinc-500 dark:text-zinc-400">Lessons</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
                    {course.lessonCount}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/60">
                  <p className="text-zinc-500 dark:text-zinc-400">Enrollments</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
                    {course.enrollmentCount}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/60">
                  <p className="text-zinc-500 dark:text-zinc-400">Comments</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
                    {course.commentCount}
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/60">
                  <p className="text-zinc-500 dark:text-zinc-400">Avg Student Progress</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
                    {course.averageStudentProgress}%
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
