"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function CommentBox({
  lessonId,
  token,
  canComment,
  currentUserId,
  canModerateComments,
}) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [content, setContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await apiFetch(
      `/lessons/${lessonId}/comments?page=1&limit=20`
    );
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setItems(data?.items ?? []);
    setPagination(data?.pagination ?? null);
  }, [lessonId]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token || !content.trim()) return;

    setError(null);
    setSubmitting(true);
    const { error: err } = await apiFetch(`/lessons/${lessonId}/comments`, {
      method: "POST",
      body: { content: content.trim() },
      token,
    });
    setSubmitting(false);

    if (err) {
      setError(err);
      return;
    }

    setContent("");
    load();
  }

  async function handleCommentUpdate(e) {
    e.preventDefault();
    if (!token || !editingCommentId || !editingContent.trim()) return;

    setError(null);
    setSubmitting(true);
    const { error: err } = await apiFetch(`/comments/${editingCommentId}`, {
      method: "PATCH",
      body: { content: editingContent.trim() },
      token,
    });
    setSubmitting(false);

    if (err) {
      setError(err);
      return;
    }

    setEditingCommentId(null);
    setEditingContent("");
    load();
  }

  async function handleCommentDelete(commentId) {
    if (!token) return;
    if (!window.confirm("Delete this comment?")) return;

    setError(null);
    setSubmitting(true);
    const { error: err } = await apiFetch(`/comments/${commentId}`, {
      method: "DELETE",
      token,
    });
    setSubmitting(false);

    if (err) {
      setError(err);
      return;
    }

    if (editingCommentId === commentId) {
      setEditingCommentId(null);
      setEditingContent("");
    }

    load();
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          💬 Comments ({pagination?.total ?? items.length})
        </h3>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <span className="animate-spin">â³</span>
          <span className="text-sm">Loading comments...</span>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          âš ï¸ {error}
        </div>
      ) : null}

      {items.length === 0 && !loading ? (
        <div className="text-center py-6 text-zinc-600 dark:text-zinc-400">
          <p className="text-lg mb-2">💭­</p>
          <p className="text-sm">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((comment) => {
            const commentOwnerId =
              comment.student?._id ?? comment.student?.id ?? comment.student;
            const canEdit =
              Boolean(currentUserId) &&
              String(commentOwnerId) === String(currentUserId);
            const canDelete = canEdit || canModerateComments;

            return (
              <li
                key={comment._id}
                className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-950"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">👤</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-zinc-900 dark:text-white">
                      {comment.student?.name ?? "Anonymous"}
                    </p>
                    {editingCommentId === comment._id ? (
                      <form onSubmit={handleCommentUpdate} className="mt-2 space-y-3">
                        <textarea
                          rows={3}
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-900"
                          maxLength={1000}
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="submit"
                            disabled={submitting || !editingContent.trim()}
                            className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditingContent("");
                            }}
                            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 break-words">
                        {comment.content}
                      </p>
                    )}
                  </div>
                  {canEdit || canDelete ? (
                    <div className="flex items-center gap-2">
                      {canEdit ? (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setEditingContent(comment.content);
                          }}
                          className="rounded-lg border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                        >
                          Edit
                        </button>
                      ) : null}
                      {canDelete ? (
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handleCommentDelete(comment._id)}
                          className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30"
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {canComment && token ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm placeholder-zinc-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:placeholder-zinc-400 transition-all"
            placeholder="Share your thoughts about this lesson..."
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {content.length}/1000
            </span>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 transition-all dark:from-violet-500 dark:to-purple-500"
            >
              ✉️ Post Comment
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
