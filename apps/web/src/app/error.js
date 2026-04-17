"use client";

import ErrorMessage from "@/components/ui/ErrorMessage";

export default function Error({ error, reset }) {
  return (
    <div className="py-8">
      <ErrorMessage message={error?.message || "Something went wrong"} onRetry={reset} />
    </div>
  );
}
