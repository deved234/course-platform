import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center space-y-8">
      <div className="space-y-4">
        <div className="inline-block rounded-lg bg-gradient-to-r from-violet-100 to-purple-100 px-4 py-2 dark:from-violet-950 dark:to-purple-950">
          <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">Welcome to Learning Hub</p>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Learn, Grow & Succeed
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Access courses from expert instructors, track your progress, earn certificates, and join a community of learners.
          Start your learning journey today and unlock your potential.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-6 dark:border-violet-900 dark:from-violet-950 dark:to-purple-950">
          <div className="text-3xl mb-2">📚</div>
          <h3 className="font-semibold text-zinc-900 dark:text-white">Expert Courses</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Learn from industry professionals</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:border-emerald-900 dark:from-emerald-950 dark:to-teal-950">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold text-zinc-900 dark:text-white">Track Progress</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Monitor your learning journey</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:border-amber-900 dark:from-amber-950 dark:to-orange-950">
          <div className="text-3xl mb-2">💬</div>
          <h3 className="font-semibold text-zinc-900 dark:text-white">Engage & Learn</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Interact with instructors & peers</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pt-4">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg hover:shadow-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 dark:from-violet-500 dark:to-purple-500"
        >
          🎯 Browse Courses
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-violet-200 px-6 py-3 font-medium text-violet-700 hover:bg-violet-50 transition-all duration-200 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-950"
        >
          ✨ Create Account
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 hover:bg-zinc-50 transition-all duration-200 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          🔐 Sign In
        </Link>
      </div>
    </div>
  );
}
