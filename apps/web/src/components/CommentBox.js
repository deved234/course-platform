"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function CommentBox({ lessonId, token, canComment }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await apiFetch(`/lessons/${lessonId}/comments?page=1&limit=20`);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setItems(data?.items ?? []);
    setPagination(data?.pagination ?? null);
  }, [lessonId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token || !content.trim()) return;
    setError(null);
    const { error: err } = await apiFetch(`/lessons/${lessonId}/comments`, {
      method: "POST",
      body: { content: content.trim() },
      token,
    });
    if (err) {
      setError(err);
      return;
    }
    setContent("");
    load();
  }

  return (
    <div className="mt-3 rounded-md border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
      <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Comments</p>
      {loading ? <p className="mt-2 text-sm text-zinc-500">Loading comments…</p> : null}
      {error ? <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <ul className="mt-2 space-y-2">
        {items.map((c) => (
          <li key={c._id} className="text-sm text-zinc-800 dark:text-zinc-200">
            <span className="font-medium">{c.student?.name ?? "Student"}:</span> {c.content}
          </li>
        ))}
      </ul>
      {pagination ? (
        <p className="mt-2 text-xs text-zinc-500">
          {items.length} of {pagination.total} comments
        </p>
      ) : null}
      {canComment && token ? (
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            placeholder="Write a comment…"
            maxLength={1000}
          />
          <button
            type="submit"
            className="self-start rounded bg-zinc-900 px-3 py-1 text-sm text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Post comment
          </button>
        </form>
      ) : null}
    </div>
  );
}
