export default function Spinner({ className = "" }) {
  return (
    <div
      className={`inline-block size-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-800 dark:border-zinc-600 dark:border-t-zinc-200 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
