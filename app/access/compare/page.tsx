import Link from "next/link";
import { ArrowRight } from "lucide-react";

const MODES = [
  {
    id: "identity-based",
    label: "Identity-Based",
    parties: "Agent + Resource",
    color: "text-green-400",
    border: "border-green-500/30",
    href: "/access/identity-based",
    participants: ["Agent", "Resource"],
    flow: [
      { arrow: "Agent → Resource", note: "HTTPSig w/ agent token" },
      { arrow: "Resource → Agent", note: "200 OK (access decision by agent identity)" },
    ],
    tokens: ["aa-agent+jwt"],
    infra: "None — just the agent and resource",
    useCase: "Replacing API keys with cryptographic identity",
    tradeoff: "Resource maintains its own access policy by agent identity",
  },
  {
    id: "resource-managed",
    label: "Resource-Managed",
    parties: "Two-Party",
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    href: "/access/resource-managed",
    participants: ["Agent", "Resource"],
    flow: [
      { arrow: "Agent → Resource", note: "HTTPSig w/ agent token" },
      { arrow: "Resource → Agent", note: "202 + AAuth-Requirement: interaction" },
      { arrow: "User → Resource", note: "Completes interaction at resource's own page" },
      { arrow: "Agent → Resource", note: "Poll → 200 + AAuth-Access (opaque token)" },
      { arrow: "Agent → Resource", note: "Subsequent calls: Authorization: AAuth <token>" },
    ],
    tokens: ["aa-agent+jwt", "AAuth-Access (opaque)"],
    infra: "Resource handles auth itself (interaction, OAuth/OIDC, internal policy)",
    useCase: "Resource manages authorization without an external PS or AS",
    tradeoff: "Token is opaque and bound to the resource via the HTTP signature",
  },
  {
    id: "ps-asserted",
    label: "PS-Asserted",
    parties: "Three-Party",
    color: "text-purple-400",
    border: "border-purple-500/30",
    href: "/access/ps-asserted",
    participants: ["Agent", "Resource", "Person Server"],
    flow: [
      { arrow: "Agent → Resource", note: "HTTPSig → 401 + resource token (aud=PS)" },
      { arrow: "Agent → PS", note: "POST /token w/ resource token" },
      { arrow: "PS → Agent", note: "Auth token (iss=PS, dwk=aauth-person.json)" },
      { arrow: "Agent → Resource", note: "Present auth token → 200" },
    ],
    tokens: ["aa-agent+jwt", "aa-resource+jwt", "aa-auth+jwt (from PS)"],
    infra: "Person Server (no Access Server)",
    useCase: "Resource accepts identity claims (sub, email, tenant, groups, roles) from any PS",
    tradeoff: "Resource still applies its own policy on the asserted claims",
  },
  {
    id: "federated",
    label: "Federated",
    parties: "Four-Party",
    color: "text-orange-400",
    border: "border-orange-500/30",
    href: "/access/federated",
    participants: ["Agent", "Resource", "Person Server", "Access Server"],
    flow: [
      { arrow: "Agent → Resource", note: "HTTPSig → 401 + resource token (aud=AS)" },
      { arrow: "Agent → PS", note: "POST /token w/ resource token" },
      { arrow: "PS → AS", note: "PS federates: POST /token (signed)" },
      { arrow: "AS → PS → Agent", note: "Auth token (iss=AS, dwk=aauth-access.json)" },
      { arrow: "Agent → Resource", note: "Present auth token → 200" },
    ],
    tokens: ["aa-agent+jwt", "aa-resource+jwt", "aa-auth+jwt (from AS)"],
    infra: "Person Server + Access Server, PS-AS trust (pre-established or dynamic)",
    useCase: "Cross-domain access with the resource's AS enforcing policy",
    tradeoff: "Most moving parts; the PS-AS trust path must be established",
  },
];

export default function AccessComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">Resource Access</p>
        <h1 className="text-3xl font-bold">Resource Access Mode Comparison</h1>
        <p className="text-muted-foreground max-w-3xl">
          AAuth defines four resource access modes, from simple identity verification to full
          four-party federation. The protocol works in every mode — adoption does not require
          coordination between parties. Agent governance (missions, permission, audit, interaction
          relay) is an orthogonal layer that any agent with a PS can add on top of any mode.
        </p>
      </div>

      {/* Mode cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MODES.map((m) => (
          <div key={m.id} className={`rounded-xl border ${m.border} bg-card p-5 space-y-4`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`font-semibold ${m.color}`}>{m.label}</p>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{m.parties}</p>
              </div>
              <Link href={m.href} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0">
                Live demo <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Participants */}
            <div className="flex flex-wrap gap-2">
              {m.participants.map((p) => {
                const colors: Record<string, string> = {
                  Agent: "bg-participant-agent", Resource: "bg-participant-resource",
                  "Person Server": "bg-participant-ps", "Access Server": "bg-participant-as",
                  User: "bg-participant-user",
                };
                return (
                  <span key={p} className={`${colors[p] ?? "bg-muted"} rounded px-2 py-0.5 text-[10px] font-semibold`}>
                    {p}
                  </span>
                );
              })}
            </div>

            {/* Flow */}
            <div className="space-y-1.5">
              {m.flow.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="font-mono text-muted-foreground/50 shrink-0 mt-px">{i + 1}.</span>
                  <div>
                    <span className="font-mono text-foreground/80">{step.arrow}</span>
                    <span className="text-muted-foreground ml-2">{step.note}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tokens */}
            {m.tokens.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Tokens</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.tokens.map((t) => (
                    <span key={t} className="text-[10px] font-mono bg-muted rounded px-2 py-0.5 text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs border-t border-border pt-3">
              <div>
                <p className="text-muted-foreground/60 text-[10px] uppercase tracking-wider mb-1">Infrastructure</p>
                <p className="text-muted-foreground">{m.infra}</p>
              </div>
              <div>
                <p className="text-muted-foreground/60 text-[10px] uppercase tracking-wider mb-1">Best for</p>
                <p className="text-muted-foreground">{m.useCase}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progressive complexity note */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-3">
        <h2 className="text-sm font-semibold">Progressive Adoption</h2>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Each mode is independently deployable. A resource can start by just verifying the agent&apos;s
          signature (identity-based) and later add interaction-based authorization (resource-managed),
          accept identity claims from any PS (PS-asserted), or deploy its own access server
          (federated) — without changing the agent&apos;s signing approach. The main change is what the
          resource returns in its `401` challenge and which party mints the eventual auth token.
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="text-green-400">Identity-Based</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-cyan-400">Resource-Managed</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-purple-400">PS-Asserted</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-orange-400">Federated</span>
        </div>
      </div>

      {/* Collocation callout */}
      <div className="rounded-xl border border-dashed border-border/70 bg-muted/10 p-5 space-y-2">
        <p className="text-sm font-medium">Roles vs. deployment</p>
        <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
          AP, PS, AS, Resource, and Agent are <em>roles</em>, not deployment units. A single
          server can fill multiple roles — for example, an organizational deployment may
          operate AP + PS + AS together for employees and internal resources, with federation
          only incurred at the boundary. When the agent&apos;s PS and the resource&apos;s AS are the
          same server (&quot;PS-AS Collapse&quot;), federation reduces to a single internal
          evaluation. The wire protocol is unchanged regardless of collocation.
        </p>
      </div>
    </div>
  );
}
