export default function Badge({ role }) {
  const label = role === "instructor" ? "Instructor" : role === "student" ? "Student" : "Guest";
  const styles =
    role === "instructor"
      ? "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200"
      : role === "student"
        ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
        : "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}
