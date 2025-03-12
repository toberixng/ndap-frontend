// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/register", "/login"]);

export default clerkMiddleware(async (auth, request) => {
  const authObject = await auth(); // Await the Promise to get ClerkMiddlewareAuthObject
  const { userId } = authObject;

  if (!isPublicRoute(request) && !userId) {
    return Response.redirect(new URL("/login", request.url));
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};