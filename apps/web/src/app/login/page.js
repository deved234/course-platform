"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import ErrorMessage from "@/components/ui/ErrorMessage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const { data, error: err } = await apiFetch("/auth/login", {
      method: "POST",
      body: { email, password },
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
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-xl font-bold">Log in</h1>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 px-2 py-1 dark:border-zinc-600 dark:bg-zinc-900"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No account?{" "}
        <Link href="/register" className="font-medium underline">
          Register
        </Link>
      </p>
    </div>
  );
}
