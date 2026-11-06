import { NextResponse, type NextRequest } from "next/server";
import type { RouteDef } from "@/constants/routes";
import { matchRoute } from "@/lib/routes";

// Routes are closed by default: only entries in src/constants/routes.ts are reachable.
// Must not import @/env or anything server-only, so it reads NODE_ENV directly.

// A path with no route file, so rewriting to it renders app/not-found.tsx with a 404.
const NOT_FOUND_PATH = "/__not-found";

const isProduction = process.env.NODE_ENV === "production";

function isApiPath(pathname: string): boolean {
  return pathname === "/api" || pathname.startsWith("/api/");
}

function notFound(request: NextRequest, api: boolean) {
  if (api) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url));
}

function allowedMethods(route: RouteDef, request: NextRequest): string[] {
  if (route.kind === "api") {
    const methods: string[] = [...(route.methods ?? [])];
    if (methods.includes("GET")) methods.push("HEAD");
    return methods;
  }
  // Pages: POST only for server actions, which carry the Next-Action header.
  return request.headers.has("next-action") ? ["GET", "HEAD", "POST"] : ["GET", "HEAD"];
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const route = matchRoute(pathname);

  if (!route || (route.devOnly && isProduction)) {
    return notFound(request, route ? route.kind === "api" : isApiPath(pathname));
  }

  const allowed = allowedMethods(route, request);
  if (!allowed.includes(request.method)) {
    const headers = { Allow: allowed.join(", ") };
    return route.kind === "api"
      ? NextResponse.json({ error: "Method not allowed" }, { status: 405, headers })
      : new NextResponse("Method not allowed", { status: 405, headers });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets/|favicon.ico).*)"],
};
