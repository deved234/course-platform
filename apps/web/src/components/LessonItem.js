"use client";

import CommentBox from "@/components/CommentBox";

export default function LessonItem({ lesson, token, canComment }) {
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
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap text-base text-zinc-700 leading-relaxed dark:text-zinc-300">
          {lesson.content}
        </p>
      </div>
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <CommentBox lessonId={lesson._id} token={token} canComment={canComment} />
      </div>
    </li>
  );
}
