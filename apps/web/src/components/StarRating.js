"use client";

export default function StarRating({ value, onChange, disabled }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange?.(n)}
          className={`text-xl leading-none ${n <= value ? "text-amber-500" : "text-zinc-300 dark:text-zinc-600"} disabled:opacity-50`}
          aria-label={`Rate ${n} stars`}
        >
          {n <= value ? "\u2605" : "\u2606"}
        </button>
      ))}
    </div>
  );
}
