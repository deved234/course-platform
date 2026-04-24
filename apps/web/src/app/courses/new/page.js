"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function NewCoursePage() {
  const router = useRouter();
  const { token, role, isLoggedIn } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token || role !== "instructor") return;

    setPending(true);
    setError(null);

    const { data, error: err } = await apiFetch("/courses", {
      method: "POST",
      body: { title, description, category },
      token,
    });

    setPending(false);
    if (err) {
      setError(err);
      return;
    }

    router.push(`/courses/${data._id}`);
    router.refresh();
  }

  if (!isLoggedIn) {
    return (
      <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Create Course</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          You need to sign in as an instructor before creating a course.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Sign In
          </Link>
          <Link
            href="/courses"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (role !== "instructor") {
    return (
      <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-8 dark:border-amber-900 dark:bg-amber-950/30">
        <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-200">Instructor Only</h1>
        <p className="text-amber-800 dark:text-amber-300">
          Only instructor accounts can create courses.
        </p>
        <Link
          href="/courses"
          className="inline-flex rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950/50"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">Create New Course</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Add the core information first, then start building lessons inside the course page.
        </p>
      </div>

      <ErrorMessage message={error} onRetry={() => setError(null)} />

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Course Title
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-900"
            placeholder="e.g. Advanced Node.js APIs"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Category
          </label>
          <input
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-900"
            placeholder="e.g. Backend"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Description
          </label>
          <textarea
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-900"
            placeholder="Describe what students will learn from this course."
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {pending ? "Creating..." : "Create Course"}
          </button>
          <Link
            href="/courses"
            className="rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
