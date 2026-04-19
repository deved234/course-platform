export default function Spinner({ className = "" }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div
        className={`inline-block size-6 animate-spin rounded-full border-2 border-violet-300 border-t-violet-600 dark:border-violet-700 dark:border-t-violet-400 ${className}`}
        role="status"
        aria-label="Loading"
      />
      <span className="text-sm text-zinc-600 dark:text-zinc-400">Loading...</span>
    </div>
  );
}
