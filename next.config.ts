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
  outputFileTracingRoot: turbopackRoot,
  turbopack: {
    root: turbopackRoot,
  },
};

export default nextConfig;
