"use client";

import { useState } from "react";
import CommentBox from "@/components/CommentBox";

export default function LessonItem({
  lesson,
  token,
  canComment,
  canManageLesson,
  canModerateComments,
  currentUserId,
  onUpdateLesson,
  onDeleteLesson,
  pending,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content);
  const [order, setOrder] = useState(lesson.order);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const didUpdate = await onUpdateLesson?.(lesson._id, {
      title,
      content,
      order: Number(order),
    });

    if (!didUpdate) {
      setError("Failed to update lesson");
      return;
    }

    setIsEditing(false);
  }

  async function handleDelete() {
    setError(null);
    const didDelete = await onDeleteLesson?.(lesson._id);
    if (!didDelete) {
      setError("Failed to delete lesson");
    }
  }

  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-950 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/30 dark:text-violet-300">
              Lesson {lesson.order}
            </span>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            {lesson.title}
          </h3>
        </div>
        {canManageLesson ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing((value) => !value);
                setError(null);
              }}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={handleDelete}
              className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30"
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Lesson Title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Content
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Order
            </label>
            <input
              required
              type="number"
              min="1"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-32 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </div>
          {error ? (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
          ) : null}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle(lesson.title);
                setContent(lesson.content);
                setOrder(lesson.order);
                setIsEditing(false);
                setError(null);
              }}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Reset
            </button>
          </div>
        </form>
      ) : (
        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-base text-zinc-700 leading-relaxed dark:text-zinc-300">
            {lesson.content}
          </p>
        </div>
      )}
      {error ? (
        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
      ) : null}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <CommentBox
          lessonId={lesson._id}
          token={token}
          canComment={canComment}
          currentUserId={currentUserId}
          canModerateComments={canModerateComments}
        />
      </div>
    </li>
  );
}
