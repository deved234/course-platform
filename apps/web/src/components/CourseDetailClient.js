"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import LessonItem from "@/components/LessonItem";
import StarRating from "@/components/StarRating";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Link from "next/link";

export default function CourseDetailClient({ courseId, initialCourse, initialLessons }) {
  const { user, token, role, isLoggedIn } = useAuth();
  const [course, setCourse] = useState(initialCourse);
  const [lessons, setLessons] = useState(initialLessons);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonOrder, setLessonOrder] = useState(1);

  const [rating, setRating] = useState(5);
  const [progress, setProgress] = useState(0);

  const instructorId = course?.instructor?._id ?? course?.instructor;
  const isOwner = useMemo(() => {
    if (!user || !instructorId) return false;
    return String(instructorId) === String(user.id);
  }, [user, instructorId]);

  const isGuest = !isLoggedIn;
  const isStudent = role === "student";
  const isInstructor = role === "instructor";

  async function refreshCourse() {
    const { data, error: err } = await apiFetch(`/courses/${courseId}`);
    if (!err && data) setCourse(data);
  }

  async function refreshLessons() {
    const { data, error: err } = await apiFetch(`/courses/${courseId}/lessons`);
    if (!err && Array.isArray(data)) setLessons(data);
  }

  async function handleEnroll() {
    if (!token) return;
    setPending(true);
    setError(null);
    setMessage(null);
    const { error: err } = await apiFetch(`/courses/${courseId}/enroll`, { method: "POST", token });
    setPending(false);
    if (err) setError(err);
    else setMessage("Enrolled successfully.");
  }

  async function handleRatingSubmit() {
    if (!token) return;
    setPending(true);
    setError(null);
    setMessage(null);
    const { error: err } = await apiFetch(`/courses/${courseId}/rating`, {
      method: "POST",
      body: { rating },
      token,
    });
    setPending(false);
    if (err) setError(err);
    else {
      setMessage("Rating saved.");
      refreshCourse();
    }
  }

  async function handleProgressSubmit() {
    if (!token) return;
    setPending(true);
    setError(null);
    setMessage(null);
    const { error: err } = await apiFetch(`/courses/${courseId}/progress`, {
      method: "PATCH",
      body: { progressPercent: Number(progress) },
      token,
    });
    setPending(false);
    if (err) setError(err);
    else setMessage("Progress updated.");
  }

  async function handleAddLesson(e) {
    e.preventDefault();
    if (!token) return;
    setPending(true);
    setError(null);
    setMessage(null);
    const { error: err } = await apiFetch(`/courses/${courseId}/lessons`, {
      method: "POST",
      body: {
        title: lessonTitle,
        content: lessonContent,
        order: Number(lessonOrder),
      },
      token,
    });
    setPending(false);
    if (err) {
      setError(err);
      return;
    }
    setMessage("Lesson created.");
    setLessonTitle("");
    setLessonContent("");
    setLessonOrder((n) => Number(n) + 1);
    refreshLessons();
  }

  const ratingDisplay =
    typeof course?.averageRating === "number" ? course.averageRating.toFixed(2) : "—";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-zinc-500">{course.category}</p>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{course.title}</h1>
        <p className="mt-2 text-zinc-700 dark:text-zinc-300">{course.description}</p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Instructor: {course.instructor?.name ?? "—"} · Average rating: {ratingDisplay}
        </p>
      </div>

      <ErrorMessage message={error} onRetry={() => setError(null)} />
      {message ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100">
          {message}
        </p>
      ) : null}

      {isGuest ? (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
          <Link href="/login" className="font-medium text-zinc-900 underline dark:text-zinc-100">
            Log in
          </Link>{" "}
          to enroll, rate, or comment.
        </p>
      ) : null}

      {isStudent ? (
        <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Student actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={pending || !token}
              onClick={handleEnroll}
              className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              Enroll in course
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Rate course (1–5)</p>
            <StarRating value={rating} onChange={setRating} disabled={pending} />
            <button
              type="button"
              disabled={pending || !token}
              onClick={handleRatingSubmit}
              className="mt-2 rounded border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-600"
            >
              Submit rating
            </button>
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Progress (%)
              <input
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                className="ml-2 w-20 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-900"
              />
            </label>
            <button
              type="button"
              disabled={pending || !token}
              onClick={handleProgressSubmit}
              className="ml-3 rounded border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-600"
            >
              Update progress
            </button>
          </div>
        </section>
      ) : null}

      {isInstructor ? (
        <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Add lesson</h2>
          {!isOwner ? (
            <p className="text-sm text-amber-800 dark:text-amber-200">
              You can only add lessons to courses you own. If you are the owner, refresh after logging in as the correct instructor.
            </p>
          ) : null}
          <form onSubmit={handleAddLesson} className="space-y-2">
            <input
              required
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Title"
              className="w-full rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            />
            <textarea
              required
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
              placeholder="Content"
              rows={4}
              className="w-full rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            />
            <input
              required
              type="number"
              min={1}
              value={lessonOrder}
              onChange={(e) => setLessonOrder(e.target.value)}
              className="w-32 rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            />
            <button
              type="submit"
              disabled={pending || !token || !isOwner}
              className="rounded bg-violet-700 px-3 py-2 text-sm text-white disabled:opacity-50"
            >
              Create lesson
            </button>
          </form>
        </section>
      ) : null}

      <section>
        <h2 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">Lessons</h2>
        {lessons.length === 0 ? (
          <p className="text-sm text-zinc-500">No lessons yet.</p>
        ) : (
          <ul className="space-y-4">
            {lessons.map((lesson) => (
              <LessonItem
                key={lesson._id}
                lesson={lesson}
                token={token}
                canComment={isStudent && Boolean(token)}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
