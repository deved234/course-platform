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
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }

  const items = data?.items ?? [];

  return (
    <div>
      <h1 className="text-xl font-bold">My enrollments</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {data?.pagination?.total ?? items.length} enrollment {(data?.pagination?.total ?? items.length) === 1 ? "" : "s"}
      </p>
      <ul className="mt-6 space-y-3">
        {items.map((enrollment) => {
          const course = enrollment.course;
          const courseId = course?._id ?? enrollment.course;
          const title = course?.title ?? "Course";
          return (
            <li
              key={enrollment._id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <Link href={`/courses/${courseId}`} className="font-medium text-zinc-900 hover:underline dark:text-zinc-50">
                {title}
              </Link>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Progress: {enrollment.progressPercent ?? 0}%
              </p>
            </li>
          );
        })}
      </ul>
      {items.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">
          You are not enrolled in any course yet.{" "}
          <Link href="/courses" className="underline">
            Browse courses
          </Link>
        </p>
      ) : null}
    </div>
  );
}
