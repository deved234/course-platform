"use client";

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200 shadow-sm"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none">❌</span>
        <div className="flex-1">
          <p className="font-semibold">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-sm font-semibold text-red-700 hover:text-red-900 underline dark:text-red-300 dark:hover:text-red-100 transition-colors"
            >
              Try Again →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
