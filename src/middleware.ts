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

 // Allow access only to the homepage ("/")
//  if (nextUrl.pathname === "/") {
//   return NextResponse.next();
// }

// // Redirect all other pages back to the home page
// return NextResponse.redirect(new URL("/", nextUrl));



  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);

  // Check if any `authRoute` is a prefix of the current path
  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (isApiAuthRoute || isPublicRoutes) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedin) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    } else {
      return NextResponse.next();
    }
  }

  if (!isLoggedin && !isPublicRoutes) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});


// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets/).*)"],
};
