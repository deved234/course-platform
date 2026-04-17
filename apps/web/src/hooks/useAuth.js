"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuth, getToken, getUser } from "@/lib/auth";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setUser(getUser());
    setToken(getToken());
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setToken(null);
    router.push("/login");
    router.refresh();
  }, [router]);

  const role = user?.role ?? null;
  const isLoggedIn = Boolean(token && user);

  return { user, token, role, isLoggedIn, logout };
}
