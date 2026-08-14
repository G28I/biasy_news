import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes (home, showcase, sign-in, sign-up)
// Article routes (/article/*) are protected by default
const isPublicRoute = createRouteMatcher([
  "/",
  "/showcase",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.[^?]*).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
