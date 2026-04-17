"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Badge from "@/components/ui/Badge";

export default function Navbar() {
  const { user, role, isLoggedIn, logout } = useAuth();

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Course Platform
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/courses" className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
            Courses
          </Link>
          {isLoggedIn ? (
            <Link
              href="/me/enrollments"
              className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              My enrollments
            </Link>
          ) : null}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-zinc-600 sm:inline dark:text-zinc-400">{user?.name}</span>
              <Badge role={role} />
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-zinc-300 px-2 py-1 text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md border border-zinc-300 px-2 py-1 text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-zinc-900 px-2 py-1 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
