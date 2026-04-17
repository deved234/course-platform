"use client";

import CommentBox from "@/components/CommentBox";

export default function LessonItem({ lesson, token, canComment }) {
  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs text-zinc-500">Lesson {lesson.order}</span>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{lesson.title}</h3>
        </div>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">{lesson.content}</p>
      <CommentBox lessonId={lesson._id} token={token} canComment={canComment} />
    </li>
  );
}
