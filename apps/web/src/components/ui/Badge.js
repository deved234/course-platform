export default function Badge({ role }) {
  if (role === "instructor") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:from-violet-950/30 dark:to-purple-950/30 dark:text-violet-300">
        👨‍🏫 Instructor
      </span>
    );
  }

  if (role === "student") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:from-emerald-950/30 dark:to-teal-950/30 dark:text-emerald-300">
        🎓 Student
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100">
      👤 Guest
    </span>
  );
}
