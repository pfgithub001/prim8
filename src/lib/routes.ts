import { routeDefs, type RouteDef, type RouteName } from "@/constants/routes";

// --- Matching -------------------------------------------------------------

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compilePattern(pattern: string): RegExp {
  if (pattern === "/") return /^\/$/;
  const body = pattern
    .split("/")
    .map((segment) => (segment.startsWith(":") ? "[^/]+" : escapeRegExp(segment)))
    .join("/");
  return new RegExp(`^${body}/?$`);
}

const compiled: readonly { regex: RegExp; def: RouteDef }[] = Object.values(routeDefs).map(
  (def: RouteDef) => ({ regex: compilePattern(def.pattern), def }),
);

export function matchRoute(pathname: string): RouteDef | undefined {
  return compiled.find(({ regex }) => regex.test(pathname))?.def;
}

// --- Building URLs --------------------------------------------------------

type ParamNames<P extends string> = P extends `${string}:${infer Name}/${infer Rest}`
  ? Name | ParamNames<`/${Rest}`>
  : P extends `${string}:${infer Name}`
    ? Name
    : never;

type RouteParams<N extends RouteName> = ParamNames<(typeof routeDefs)[N]["pattern"]>;

type HrefArgs<N extends RouteName> = [RouteParams<N>] extends [never]
  ? []
  : [params: Record<RouteParams<N>, string | number>];

export function href<N extends RouteName>(name: N, ...[params]: HrefArgs<N>): string {
  const pattern: string = routeDefs[name].pattern;
  if (!params) return pattern;
  const values: Record<string, string | number> = params;
  return pattern.replace(/:([^/]+)/g, (_, key: string) => {
    const value = values[key];
    if (value === undefined) throw new Error(`Missing param "${key}" for route "${name}"`);
    return encodeURIComponent(String(value));
  });
}
