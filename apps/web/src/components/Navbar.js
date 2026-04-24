"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Badge from "@/components/ui/Badge";

export default function Navbar() {
  const { user, role, isLoggedIn, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md shadow-sm dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-purple-400 hover:from-violet-700 hover:to-purple-700 transition-all">
          🎓 Learning Hub
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-sm font-medium">
          <Link href="/courses" className="text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
            📚 Courses
          </Link>
          {isLoggedIn && role === "instructor" ? (
            <Link
              href="/courses/new"
              className="text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors"
            >
              Create Course
            </Link>
          ) : null}
          {isLoggedIn ? (
            <Link
              href="/me/enrollments"
              className="text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors"
            >
              📖 My Courses
            </Link>
          ) : null}
          {isLoggedIn ? (
            <div className="flex items-center gap-3 pl-6 border-l border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{user?.name}</p>
                  <Badge role={role} />
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-red-950/30 dark:hover:border-red-700"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-6 border-l border-zinc-200 dark:border-zinc-800">
              <Link
                href="/login"
                className="rounded-lg border border-violet-300 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-50 transition-colors dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-950/30"
              >
                🔓 Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg dark:from-violet-500 dark:to-purple-500"
              >
                ✨ Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
