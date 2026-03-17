import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/generate"]);

export default clerkMiddleware(async (auth, req) => {
    const url = req.nextUrl.clone();
    const host = req.headers.get("host");

    // Enforce canonical domain: www -> non-www
    if (host === "www.auricai.tech") {
        url.host = "auricai.tech";
        return Response.redirect(url.toString(), 301);
    }

    const session = await auth();
    if (!session.userId && isProtectedRoute(req)) {
        return session.redirectToSignIn();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
