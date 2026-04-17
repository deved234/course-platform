"use client";

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
      role="alert"
    >
      <p>{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-sm font-medium text-red-900 underline hover:no-underline dark:text-red-100"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
