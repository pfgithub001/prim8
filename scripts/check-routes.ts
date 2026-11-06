// Checks that src/app and the route registry (src/constants/routes.ts) agree.
// Runs with plain node (type stripping): `node scripts/check-routes.ts`.

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { routeDefs, type RouteDef } from "../src/constants/routes.ts";

type RouteFile = { pattern: string; kind: RouteDef["kind"]; file: string };

const appDir = path.join(import.meta.dirname, "..", "src", "app");
const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx)$/;
const ROUTE_FILE = /^route\.(tsx|ts|jsx|js)$/;
const HTTP_EXPORT =
  /export\s+(?:async\s+function|function|const|let)\s+(GET|HEAD|POST|PUT|PATCH|DELETE|OPTIONS)\b/g;

const errors: string[] = [];

function segmentToPattern(segment: string, file: string): string | null {
  if (/^\(.*\)$/.test(segment) || segment.startsWith("@")) return null; // route group / slot
  if (segment.startsWith("[...") || segment.startsWith("[[...")) {
    errors.push(`${file}: catch-all segments are not supported (ask before adding one)`);
    return null;
  }
  if (/^\(\.+\)/.test(segment)) {
    errors.push(`${file}: intercepting routes are not supported`);
    return null;
  }
  const dynamic = /^\[(.+)\]$/.exec(segment);
  return dynamic ? `:${dynamic[1]}` : segment;
}

function collect(dir: string, segments: string[], out: RouteFile[]) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(process.cwd(), full);
    if (entry.isDirectory()) {
      if (entry.name.startsWith("_")) continue; // private folder
      collect(full, [...segments, entry.name], out);
      continue;
    }
    const kind = PAGE_FILE.test(entry.name) ? "page" : ROUTE_FILE.test(entry.name) ? "api" : null;
    if (!kind) continue;
    const parts = segments.map((s) => segmentToPattern(s, rel)).filter((s) => s !== null);
    out.push({ pattern: `/${parts.join("/")}`, kind, file: rel });
  }
}

function exportedMethods(file: string): string[] {
  const source = readFileSync(file, "utf8");
  return [...source.matchAll(HTTP_EXPORT)].map((match) => match[1]);
}

const sameSet = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((x) => b.includes(x));

const files: RouteFile[] = [];
collect(appDir, [], files);

const defs: [string, RouteDef][] = Object.entries(routeDefs);

for (const file of files) {
  const def = defs.find(([, d]) => d.pattern === file.pattern);
  if (!def) {
    errors.push(`${file.file}: "${file.pattern}" is not registered in src/constants/routes.ts`);
  } else if (def[1].kind !== file.kind) {
    errors.push(`${file.file}: registry entry "${def[0]}" has kind "${def[1].kind}"`);
  }
}

for (const [name, def] of defs) {
  const file = files.find((f) => f.pattern === def.pattern && f.kind === def.kind);
  if (!file) {
    errors.push(`routes.ts "${name}": no ${def.kind} file for "${def.pattern}" in src/app`);
    continue;
  }
  if (def.kind !== "api") continue;
  if (!def.methods || def.methods.length === 0) {
    errors.push(`routes.ts "${name}": api routes must list their methods`);
    continue;
  }
  const exported = exportedMethods(file.file);
  if (!sameSet(def.methods, exported)) {
    errors.push(
      `routes.ts "${name}": methods [${def.methods.join(", ")}] don't match ` +
        `${file.file} exports [${exported.join(", ")}]`,
    );
  }
}

if (errors.length > 0) {
  console.error(`Route check failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  process.exit(1);
}

console.log(`Route check passed (${files.length} route files, ${defs.length} registry entries).`);
