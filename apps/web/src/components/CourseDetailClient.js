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
  const [lessons, setLessons] = useState(initialLessons || []);
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

  const ratingDisplay = course?.rating?.toFixed(1) ?? "N/A";
  const ratingCount = course?.ratingCount ?? 0;

  async function handleEnroll() {
    if (!token) return;
    setPending(true);
    setError(null);
    setMessage(null);

    const { error: err } = await apiFetch(`/courses/${courseId}/enroll`, {
      method: "POST",
      token,
    });

    setPending(false);
    if (err) {
      setError(err);
      return;
    }

    setMessage("Successfully enrolled! Welcome aboard!");
    setTimeout(() => setMessage(null), 3000);
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
    if (err) {
      setError(err);
      return;
    }

    setMessage("Rating submitted successfully!");
    setTimeout(() => setMessage(null), 3000);
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
    if (err) {
      setError(err);
      return;
    }

    setMessage("Progress updated successfully!");
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleAddLesson(e) {
    e.preventDefault();
    if (!isOwner) {
      setError("You can only add lessons to your own courses");
      return;
    }

    if (!token) return;
    setPending(true);
    setError(null);
    setMessage(null);

    const { data, error: err } = await apiFetch(`/courses/${courseId}/lessons`, {
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

    setMessage("Lesson created successfully!");
    setLessonTitle("");
    setLessonContent("");
    setLessonOrder((prev) => Number(prev) + 1);
    setLessons((current) => [...current, data]);
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {course?.category && (
            <span className="inline-block rounded-full bg-linear-to-r from-violet-100 to-purple-100 px-4 py-2 text-sm font-semibold text-violet-700 dark:from-violet-950 dark:to-purple-950 dark:text-violet-300">
              {course.category}
            </span>
          )}
          {ratingCount > 0 && (
            <span className="inline-block rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
              ⭐ {ratingDisplay} ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
            </span>
          )}
        </div>

        <h1 className="text-5xl font-bold text-zinc-900 dark:text-white leading-tight">
          {course?.title ?? "Course Details"}
        </h1>

        <p className="text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          {course?.description ?? "No description available for this course yet."}
        </p>

        <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-4">
          <span className="text-2xl">👨‍🏫</span>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Instructor</p>
            <p className="font-semibold text-zinc-900 dark:text-white">
              {course?.instructor?.name ?? "Unknown"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}
      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100 font-medium">
          ✅ {message}
        </div>
      )}

      {/* Guest Prompt */}
      {isGuest && (
        <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
          <p className="text-lg mb-3">🔐</p>
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 underline">
              Sign in
            </Link>{" "}
            to enroll, rate courses, and leave comments
          </p>
        </div>
      )}

      {/* Student Section */}
      {isStudent && (
        <div className="rounded-xl border border-zinc-200 bg-linear-to-br from-emerald-50 to-teal-50 p-6 dark:border-zinc-800 dark:from-emerald-950/20 dark:to-teal-950/20 space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            🎓 Student Actions
          </h2>

          <button
            type="button"
            disabled={pending || !token}
            onClick={handleEnroll}
            className="w-full rounded-lg bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all dark:from-emerald-500 dark:to-teal-500"
          >
            ✨ Enroll in Course
          </button>

          <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-white">⭐ Rate This Course</h3>
            <div className="space-y-3">
              <StarRating value={rating} onChange={setRating} disabled={pending} />
              <button
                type="button"
                disabled={pending || !token}
                onClick={handleRatingSubmit}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 transition-all dark:border-zinc-600 dark:hover:bg-zinc-900"
              >
                Submit Rating
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-white">📊 Track Your Progress</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="flex-1 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
                />
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 min-w-12.5 text-right">
                  {progress}%
                </span>
              </div>
              <button
                type="button"
                disabled={pending || !token}
                onClick={handleProgressSubmit}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 transition-all dark:border-zinc-600 dark:hover:bg-zinc-900"
              >
                Update Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructor Section */}
      {isInstructor && (
        <div className="rounded-xl border border-zinc-200 bg-linear-to-br from-violet-50 to-purple-50 p-6 dark:border-zinc-800 dark:from-violet-950/20 dark:to-purple-950/20 space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            ✏️ Manage Lessons
          </h2>

          {!isOwner && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              <p className="font-semibold mb-1">⚠️ Not Your Course</p>
              <p>You can only add lessons to courses you own.</p>
            </div>
          )}

          <form onSubmit={handleAddLesson} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Lesson Title
              </label>
              <input
                required
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="e.g., Introduction to React"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm placeholder-zinc-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:placeholder-zinc-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Content
              </label>
              <textarea
                required
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                placeholder="Enter lesson content..."
                rows={5}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm placeholder-zinc-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:placeholder-zinc-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Lesson Order
              </label>
              <input
                required
                type="number"
                min="1"
                value={lessonOrder}
                onChange={(e) => setLessonOrder(Number(e.target.value))}
                className="w-32 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-900 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={pending || !token || !isOwner}
              className="rounded-lg bg-violet-600 px-6 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-all"
            >
              ➕ Create Lesson
            </button>
          </form>
        </div>
      )}

      {/* Lessons Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          📚 Course Lessons ({lessons.length})
        </h2>

        {lessons.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
            <p className="text-3xl mb-3">📖</p>
            <p className="text-zinc-600 dark:text-zinc-400">No lessons added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <LessonItem
                key={lesson._id}
                lesson={lesson}
                token={token}
                canComment={isStudent && Boolean(token)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
