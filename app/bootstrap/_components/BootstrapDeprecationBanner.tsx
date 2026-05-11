import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export function BootstrapDeprecationBanner() {
  return (
    <div className="border-b border-amber-500/30 bg-amber-500/5 px-4 py-2.5">
      <div className="mx-auto max-w-6xl flex items-start gap-2 text-xs">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-muted-foreground leading-relaxed">
          <span className="font-medium text-amber-100">Pre-rewrite scenario.</span>{" "}
          This walkthrough was written against an earlier draft of{" "}
          <code className="font-mono bg-muted px-1 py-px rounded">
            draft-hardt-aauth-bootstrap
          </code>
          . As of <code className="font-mono bg-muted px-1 py-px rounded">-01</code> the
          document is informational AP-side enrollment guidance; the PS{" "}
          <code className="font-mono bg-muted px-1 py-px rounded">/bootstrap</code> endpoint,{" "}
          <code className="font-mono bg-muted px-1 py-px rounded">bootstrap_token</code>, and{" "}
          <code className="font-mono bg-muted px-1 py-px rounded">aa-bootstrap+jwt</code> have
          been removed. PS-binding now happens lazily on the agent&apos;s first interaction with
          the PS. See the{" "}
          <Link href="/bootstrap" className="text-amber-200 underline underline-offset-2">
            bootstrap overview
          </Link>{" "}
          for current framing.
        </p>
      </div>
    </div>
  );
}
