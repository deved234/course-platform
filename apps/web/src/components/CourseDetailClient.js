"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import LessonItem from "@/components/LessonItem";
import StarRating from "@/components/StarRating";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Link from "next/link";

export default function CourseDetailClient({ courseId, initialCourse, initialLessons }) {
  const router = useRouter();
  const { user, token, role, isLoggedIn } = useAuth();
  const [course, setCourse] = useState(initialCourse);
  const [lessons, setLessons] = useState(initialLessons || []);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonOrder, setLessonOrder] = useState(1);
  const [courseTitle, setCourseTitle] = useState(initialCourse?.title ?? "");
  const [courseDescription, setCourseDescription] = useState(
    initialCourse?.description ?? ""
  );
  const [courseCategory, setCourseCategory] = useState(initialCourse?.category ?? "");
  const [editingCourse, setEditingCourse] = useState(false);

  const [rating, setRating] = useState(5);
  const [progress, setProgress] = useState(0);
  const [enrollmentInfo, setEnrollmentInfo] = useState({
    isEnrolled: false,
    enrollment: null,
  });
  const [loadingEnrollment, setLoadingEnrollment] = useState(false);

  const instructorId = course?.instructor?._id ?? course?.instructor;
  const isOwner = useMemo(() => {
    if (!user || !instructorId) return false;
    return String(instructorId) === String(user.id);
  }, [user, instructorId]);

  const isGuest = !isLoggedIn;
  const isStudent = role === "student";
  const isInstructor = role === "instructor";
  const currentUserId = user?.id ?? null;
  const completedLessonIds = enrollmentInfo.enrollment?.completedLessonIds ?? [];
  const isEnrolled = Boolean(enrollmentInfo.isEnrolled);

  const ratingValue =
    typeof course?.averageRating === "number" ? course.averageRating : 0;
  const ratingDisplay = ratingValue > 0 ? ratingValue.toFixed(1) : "N/A";
  const ratingCount = Array.isArray(course?.ratings) ? course.ratings.length : 0;

  const loadEnrollment = useCallback(async () => {
    if (!token || !isStudent) return;

    setLoadingEnrollment(true);
    const { data, error: err } = await apiFetch(`/courses/${courseId}/enrollment`, {
      token,
    });
    setLoadingEnrollment(false);

    if (err) {
      setError(err);
      return;
    }

    const nextData = data ?? { isEnrolled: false, enrollment: null };
    setEnrollmentInfo(nextData);
    setProgress(nextData.enrollment?.progressPercent ?? 0);
  }, [courseId, isStudent, token]);

  useEffect(() => {
    Promise.resolve().then(loadEnrollment);
  }, [loadEnrollment]);

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
    await loadEnrollment();
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

    setCourse((current) =>
      current
        ? {
            ...current,
            averageRating: Number(rating),
            ratings: current.ratings || [],
          }
        : current
    );
    setMessage("Rating submitted successfully!");
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
    setLessons((current) =>
      [...current, data].sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return String(a._id).localeCompare(String(b._id));
      })
    );
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleUpdateLesson(lessonId, values) {
    if (!token) return false;

    setPending(true);
    setError(null);
    setMessage(null);

    const { data, error: err } = await apiFetch(`/lessons/${lessonId}`, {
      method: "PATCH",
      body: values,
      token,
    });

    setPending(false);
    if (err) {
      setError(err);
      return false;
    }

    setLessons((current) =>
      current
        .map((lesson) => (lesson._id === lessonId ? data : lesson))
        .sort((a, b) => {
          if (a.order !== b.order) return a.order - b.order;
          return String(a._id).localeCompare(String(b._id));
        })
    );
    setMessage("Lesson updated successfully!");
    setTimeout(() => setMessage(null), 3000);
    return true;
  }

  async function handleDeleteLesson(lessonId) {
    if (!token) return false;
    if (!window.confirm("Delete this lesson and its comments?")) {
      return false;
    }

    setPending(true);
    setError(null);
    setMessage(null);

    const { error: err } = await apiFetch(`/lessons/${lessonId}`, {
      method: "DELETE",
      token,
    });

    setPending(false);
    if (err) {
      setError(err);
      return false;
    }

    setLessons((current) => current.filter((lesson) => lesson._id !== lessonId));
    setMessage("Lesson deleted successfully!");
    setTimeout(() => setMessage(null), 3000);
    return true;
  }

  async function handleToggleLessonCompletion(lessonId, completed) {
    if (!token || !isStudent) return false;

    setPending(true);
    setError(null);
    setMessage(null);

    const { data, error: err } = await apiFetch(
      `/courses/${courseId}/lessons/${lessonId}/completion`,
      {
        method: "PATCH",
        body: { completed },
        token,
      }
    );

    setPending(false);
    if (err) {
      setError(err);
      return false;
    }

    setEnrollmentInfo({
      isEnrolled: true,
      enrollment: data,
    });
    setProgress(data?.progressPercent ?? 0);
    setMessage(
      completed ? "Lesson marked as complete!" : "Lesson marked as incomplete!"
    );
    setTimeout(() => setMessage(null), 3000);
    return true;
  }

  async function handleCourseUpdate(e) {
    e.preventDefault();
    if (!token || !isOwner) return;

    setPending(true);
    setError(null);
    setMessage(null);

    const { data, error: err } = await apiFetch(`/courses/${courseId}`, {
      method: "PATCH",
      body: {
        title: courseTitle,
        description: courseDescription,
        category: courseCategory,
      },
      token,
    });

    setPending(false);
    if (err) {
      setError(err);
      return;
    }

    setCourse(data);
    setEditingCourse(false);
    setMessage("Course updated successfully!");
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleCourseDelete() {
    if (!token || !isOwner) return;
    if (!window.confirm("Delete this course, all lessons, comments, and enrollments?")) {
      return;
    }

    setPending(true);
    setError(null);
    setMessage(null);

    const { error: err } = await apiFetch(`/courses/${courseId}`, {
      method: "DELETE",
      token,
    });

    setPending(false);
    if (err) {
      setError(err);
      return;
    }

    router.push("/courses");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {course?.category && (
            <span className="inline-block rounded-full bg-linear-to-r from-violet-100 to-purple-100 px-4 py-2 text-sm font-semibold text-violet-700 dark:from-violet-950 dark:to-purple-950 dark:text-violet-300">
              {course.category}
            </span>
          )}
          {ratingCount > 0 && (
            <span className="inline-block rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
              Rating {ratingDisplay} ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
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
          <span className="text-2xl">Instructor</span>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Instructor</p>
            <p className="font-semibold text-zinc-900 dark:text-white">
              {course?.instructor?.name ?? "Unknown"}
            </p>
          </div>
        </div>
      </div>

      {isOwner ? (
        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Manage Course</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Update the course details or remove the course entirely.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingCourse((value) => !value);
                  setError(null);
                }}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                {editingCourse ? "Cancel" : "Edit Course"}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={handleCourseDelete}
                className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30"
              >
                Delete Course
              </button>
            </div>
          </div>

          {editingCourse ? (
            <form
              onSubmit={handleCourseUpdate}
              className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Course Title
                </label>
                <input
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-950"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Category
                </label>
                <input
                  required
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-950"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  required
                  rows={5}
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-950"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  Save Course
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCourseTitle(course?.title ?? "");
                    setCourseDescription(course?.description ?? "");
                    setCourseCategory(course?.category ?? "");
                    setEditingCourse(false);
                    setError(null);
                  }}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  Reset
                </button>
              </div>
            </form>
          ) : null}
        </section>
      ) : null}

      {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}
      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100 font-medium">
          {message}
        </div>
      )}

      {isGuest && (
        <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            <Link
              href="/login"
              className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 underline"
            >
              Sign in
            </Link>{" "}
            to enroll, rate courses, and leave comments
          </p>
        </div>
      )}

      {isStudent ? (
        <div className="rounded-xl border border-zinc-200 bg-linear-to-br from-emerald-50 to-teal-50 p-6 dark:border-zinc-800 dark:from-emerald-950/20 dark:to-teal-950/20 space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Student Actions
          </h2>

          {isEnrolled ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              You are enrolled in this course.
            </div>
          ) : (
            <button
              type="button"
              disabled={pending || !token}
              onClick={handleEnroll}
              className="w-full rounded-lg bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all dark:from-emerald-500 dark:to-teal-500"
            >
              Enroll in Course
            </button>
          )}

          <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-white">Rate This Course</h3>
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
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              Lesson Completion Tracking
            </h3>
            {loadingEnrollment ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Loading your enrollment progress...
              </p>
            ) : isEnrolled ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Completed Lessons
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {enrollmentInfo.enrollment?.completedLessonsCount ?? 0}/
                    {enrollmentInfo.enrollment?.totalLessons ?? lessons.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Overall Progress
                  </span>
                  <span className="font-semibold text-violet-600 dark:text-violet-400">
                    {progress}%
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Mark lessons complete as you finish them to update progress automatically.
                </p>
              </div>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Enroll first to track lesson completion and progress.
              </p>
            )}
          </div>
        </div>
      ) : null}

      {isInstructor ? (
        <div className="rounded-xl border border-zinc-200 bg-linear-to-br from-violet-50 to-purple-50 p-6 dark:border-zinc-800 dark:from-violet-950/20 dark:to-purple-950/20 space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Manage Lessons
          </h2>

          {!isOwner ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              <p className="font-semibold mb-1">Not Your Course</p>
              <p>You can only add lessons to courses you own.</p>
            </div>
          ) : null}

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
              Create Lesson
            </button>
          </form>
        </div>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Course Lessons ({lessons.length})
        </h2>

        {lessons.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
            <p className="text-zinc-600 dark:text-zinc-400">No lessons added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <LessonItem
                key={lesson._id}
                lesson={lesson}
                token={token}
                canComment={isStudent && Boolean(token) && isEnrolled}
                canManageLesson={isOwner}
                canModerateComments={isOwner}
                currentUserId={currentUserId}
                onUpdateLesson={handleUpdateLesson}
                onDeleteLesson={handleDeleteLesson}
                pending={pending}
                canTrackCompletion={isStudent && isEnrolled}
                isCompleted={completedLessonIds.includes(String(lesson._id))}
                onToggleCompletion={handleToggleLessonCompletion}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
