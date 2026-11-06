// The single list of reachable routes. Anything not listed here returns 404 (see src/proxy.ts).
// Keep this file free of imports: src/proxy.ts and scripts/check-routes.ts both load it.

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RouteDef = {
  pattern: string; // "/items/:id"
  kind: "page" | "api";
  methods?: readonly Method[]; // required for api routes
  devOnly?: boolean; // 404 in production
};

export const routeDefs = {
  home: { pattern: "/", kind: "page" },
  health: { pattern: "/api/health", kind: "api", methods: ["GET"] },
  mailTest: { pattern: "/api/dev/mail-test", kind: "api", methods: ["POST"], devOnly: true },
} as const satisfies Record<string, RouteDef>;

export type RouteName = keyof typeof routeDefs;
