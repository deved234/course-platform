import { NextResponse } from "next/server";

const COOKIE_NAME = "cp_token";

export function middleware(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/me") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/courses", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/me", "/me/:path*", "/login", "/register"],
};
