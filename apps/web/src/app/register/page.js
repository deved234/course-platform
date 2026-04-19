"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const body = { name, email, password, role };
    const { data, error: err } = await apiFetch("/auth/register", {
      method: "POST",
      body,
    });
    setPending(false);
    if (err) {
      setError(err);
      return;
    }
    saveAuth(data.token, data.user);
    router.push("/courses");
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-purple-400">
            Get Started
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Join our community and start learning today
          </p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
              Full Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:placeholder-zinc-400 transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:placeholder-zinc-400 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:placeholder-zinc-400 transition-all"
              placeholder="Min. 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-white mb-3">
              Choose Your Role
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-violet-600 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400"
                />
                <span className="flex items-center gap-2">
                  <span className="text-lg">👨‍🎓</span>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">Student</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Learn from courses</p>
                  </div>
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="role"
                  value="instructor"
                  checked={role === "instructor"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-violet-600 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400"
                />
                <span className="flex items-center gap-2">
                  <span className="text-lg">👨‍🏫</span>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">Instructor</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Create courses</p>
                  </div>
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 dark:from-violet-500 dark:to-purple-500"
          >
            {pending ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
