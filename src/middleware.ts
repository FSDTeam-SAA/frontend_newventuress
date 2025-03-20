import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedin = !!req.auth;
  const pathname = nextUrl.pathname;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  
  // Check if the current path matches any public route pattern
  const isPublicRoute = publicRoutes.some(route => {
    // Handle wildcard routes like "/blogs/*"
    if (route.endsWith('/*')) {
      const baseRoute = route.slice(0, -2); // Remove the "/*"
      return pathname === baseRoute || pathname.startsWith(`${baseRoute}/`);
    }
    return pathname === route;
  });

  // Check if any `authRoute` is a prefix of the current path
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isApiAuthRoute || isPublicRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedin) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    } else {
      return NextResponse.next();
    }
  }

  if (!isLoggedin && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets/).*)"],
};