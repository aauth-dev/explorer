import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Turbopack picks the nearest lockfile as workspace root; a package-lock.json
// higher in the filesystem (e.g. under $HOME) breaks resolution for monorepo
// heuristics. Pin the root to this app directory.
//
// Also set outputFileTracingRoot to the same path: the default can inherit
// NEXT_PRIVATE_OUTPUT_TRACE_ROOT, and Next prefers that over turbopack.root
// when they disagree.
const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Every route in this app is prerendered — no route handlers, middleware,
  // server actions, or next/image. A static export therefore needs no
  // Cloudflare adapter at all: Pages serves `out/` directly.
  //
  // This replaced `npx @cloudflare/next-on-pages@1` as the build command. That
  // adapter supports next <=15.5.2 and this app is on 16, and it pulled two
  // floating peer ranges (wrangler, @cloudflare/workers-types) that drifted
  // apart upstream and broke every branch's build with ERESOLVE.
  output: 'export',
  outputFileTracingRoot: turbopackRoot,
  turbopack: {
    root: turbopackRoot,
  },
};

export default nextConfig;
