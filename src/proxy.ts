import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth: proxy } = NextAuth(authConfig);

import { env } from "@/lib/env";
import {
  apiAuthPrefix,
  authRoutes,
  checkDevelopmentRoute,
  checkPublicRoute,
  DEFAULT_LOGIN_REDIRECT,
} from "@/routes";

export default proxy((req) => {
  const url = req.nextUrl;
  const route = url.pathname;
  // const searchParams = url.searchParams.toString();
  // const hostname = req.headers;

  // const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // check subdomain here
  // const customDomains = hostname
  //   .get("host")
  //   ?.split(`${env.NEXT_PUBLIC_DOMAIN}`)
  //   .filter(Boolean)[0];
  //
  // const domain = customDomains?.split(".")[0] || "";
  // if (customDomains && domain !== env.NEXT_PUBLIC_DOMAIN) {
  //   return NextResponse.rewrite(
  //     new URL(`/${domain}${pathWithSearchParams}`, req.nextUrl),
  //   );
  // }

  const isLoggedIn = !!req.auth;

  const isDevelopmentRoute = checkDevelopmentRoute(route);
  const isApiAuthRoute = route.startsWith(apiAuthPrefix);
  const isPublicRoute = checkPublicRoute(route);
  const isAuthRoute = authRoutes.includes(route);

  const isProduction = env.NODE_ENV === "production";

  if (isProduction && isDevelopmentRoute) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
  }

  if (isApiAuthRoute) {
    return; // return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
    }
    return; // return null;
  }

  if (!isLoggedIn && !isPublicRoute && !isDevelopmentRoute) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  return; // return null;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
