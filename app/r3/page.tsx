import { Database, ArrowRight, FileJson, Shield, Clock } from "lucide-react";
import Link from "next/link";

const R3_SCENARIOS = [
  {
    title: "Vocabulary-Based Access",
    desc: "Agent discovers an MCP vocabulary, declares the exact tools it needs, and receives an auth token with r3_granted. Resource enforces directly from the token — no introspection, no scope guessing.",
    href: "/r3/vocabulary-basics",
    badge: "Happy path",
    badgeColor: "text-teal-600 dark:text-teal-400 bg-teal-500/10",
  },
  {
    title: "Per-Call Operations",
    desc: "Some operations are authorized in principle but not for any specific call. When the agent invokes an r3_per_call tool, the resource builds a per-call proposal — a full R3 document carrying that call's concrete parameters — and challenges. The AS evaluates the parameters before issuing a narrow, short-lived auth token.",
    href: "/r3/per-call-ops",
    badge: "Challenge flow",
    badgeColor: "text-amber-700 dark:text-amber-400 bg-amber-500/10",
  },
  {
    title: "Content Addressing & User Consent",
    desc: "The R3 document's display section — including irreversible action warnings — drives informed user consent. The r3_s256 hash baked into the final auth token is a permanent, verifiable audit record.",
    href: "/r3/content-addressing",
    badge: "Consent + audit",
    badgeColor: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
  },
];

const KEY_CONCEPTS = [
  {
    icon: FileJson,
    color: "text-teal-600 dark:text-teal-400",
    label: "Resource-declared",
    desc: "The resource defines authorization semantics in a signed R3 document. The agent cannot modify or reframe it — directionality is resource → AS, not client → AS.",
  },
  {
    icon: Shield,
    color: "text-blue-600 dark:text-blue-400",
    label: "Agent opacity",
    desc: "Agents carry a hash of a document they cannot read. R3 document endpoints are restricted to the resource's AS only. The agent never sees the display.irreversible field it's triggering.",
  },
  {
    icon: Database,
    color: "text-green-600 dark:text-green-400",
    label: "Content-addressed",
    desc: "r3_uri + SHA-256 hash pin the exact authorization semantics in the auth token. Infinite AS caching. Immutable audit records. Even if the resource updates the doc, existing tokens reference the approved version.",
  },
  {
    icon: Clock,
    color: "text-orange-600 dark:text-orange-400",
    label: "Per-call grants",
    desc: "r3_per_call operations require per-call approval against actual parameters. The resource builds a proposal — a full R3 document with a parameters object — and the AS evaluates who is being emailed, how large the payment is, which record is deleted. Named r3_conditional before R3 -02.",
  },
];

export default function R3OverviewPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-14">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Database className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          <span>AAuth R3 — draft-hardt-aauth-r3 (exploratory)</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Rich Resource Requests</h1>
        <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
          R3 replaces vague scope strings with structured, vocabulary-based authorization.
          Resources publish what operations they support in terms agents already understand —
          MCP tools, OpenAPI operationIds, gRPC methods. Auth tokens carry{" "}
          <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">r3_granted</code>{" "}
          and{" "}
          <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">r3_per_call</code>
          {" "}claims the resource enforces directly.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="font-semibold">Key properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {KEY_CONCEPTS.map(({ icon: Icon, color, label, desc }) => (
            <div key={label} className="flex gap-3">
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${color}`} />
              <div className="space-y-1">
                <p className={`text-xs font-semibold ${color}`}>{label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Interactive flows</h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Step through concrete protocol interactions to see how R3 works end-to-end.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {R3_SCENARIOS.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="rounded-xl border border-border bg-card p-5 flex items-start justify-between gap-4 transition-colors hover:bg-accent/50"
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                  <span className={`text-[10px] font-semibold rounded px-2 py-0.5 ${s.badgeColor}`}>
                    {s.badge}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
              <ArrowRight className="shrink-0 h-4 w-4 text-muted-foreground mt-0.5" />
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-border/70 bg-muted/10 p-5 flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">R3 extends the AAuth Protocol</p>
          <p className="text-xs text-muted-foreground">
            R3 builds on the standard resource access flows: the same person token, the same
            resource token, the same auth token. See PS authorization access before diving in.
          </p>
        </div>
        <Link
          href="/access/ps-asserted"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          PS authorization flow
          <ArrowRight className="h-3 w-3 opacity-70" />
        </Link>
      </section>
    </div>
  );
}
