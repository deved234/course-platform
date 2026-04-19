"use client";

export default function StarRating({ value, onChange, disabled }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-2 py-3">
      <div className="flex items-center gap-1">
        {stars.map((n) => (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(n)}
            className={`text-3xl leading-none transition-all duration-200 transform hover:scale-110 ${n <= value
                ? "text-amber-400 drop-shadow-md"
                : "text-zinc-300 dark:text-zinc-600"
              } disabled:opacity-50 disabled:scale-100 disabled:hover:scale-100`}
            aria-label={`Rate ${n} stars`}
          >
            {n <= value ? "⭐" : "☆"}
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className="ml-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
          {value}/5
        </span>
      )}
    </div>
  );
}
