import Link from "next/link";
import { ArrowRight } from "lucide-react";

const MODES = [
  {
    id: "identity-based",
    label: "Agent identity",
    parties: "Agent + Resource",
    color: "text-green-600 dark:text-green-400",
    border: "border-green-500/30",
    href: "/access/identity-based",
    participants: ["Agent", "Resource"],
    knows: "which agent",
    establishedBy: "the agent provider",
    flow: [
      { arrow: "Agent → Resource", note: "HTTPSig w/ agent token" },
      { arrow: "Resource → Agent", note: "200 OK (access decision by agent identity)" },
    ],
    tokens: ["aa-agent+jwt"],
    infra: "None — just the agent and resource",
    useCase: "Replacing API keys with cryptographic identity",
  },
  {
    id: "resource-managed",
    label: "Resource-managed",
    parties: "Two-Party",
    color: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-500/30",
    href: "/access/resource-managed",
    participants: ["Agent", "Resource"],
    knows: "which person",
    establishedBy: "the resource's own flow",
    flow: [
      { arrow: "Agent → Resource", note: "HTTPSig w/ agent token" },
      { arrow: "Resource → Agent", note: "202 + AAuth-Requirement: interaction" },
      { arrow: "User → Resource", note: "Completes interaction at the resource's own page" },
      { arrow: "Agent → Resource", note: "Poll → 200 + AAuth-Access (session token)" },
      { arrow: "Agent → Resource", note: "Subsequent calls: Authorization: AAuth <session token>" },
    ],
    tokens: ["aa-agent+jwt", "session token (opaque)"],
    infra: "Resource handles auth itself (interaction, OAuth/OIDC, internal policy)",
    useCase: "Resource manages authorization without an external PS or AS",
  },
  {
    id: "person-identity",
    label: "Person identity",
    parties: "Three-Party",
    color: "text-sky-600 dark:text-sky-400",
    border: "border-sky-500/30",
    href: "/access/person-identity",
    participants: ["Agent", "Resource", "Person Server"],
    knows: "which person",
    establishedBy: "the person server",
    flow: [
      { arrow: "Agent → PS", note: "POST person_token_endpoint {resource}" },
      { arrow: "PS → Agent", note: "aa-person+jwt: aud=resource, directed sub, cnf=agent key" },
      { arrow: "Agent → Resource", note: "HTTPSig w/ person token in place of the agent token" },
      { arrow: "Resource → Agent", note: "200 OK (access decision by person identity)" },
    ],
    tokens: ["aa-agent+jwt", "aa-person+jwt"],
    infra: "Person Server only — never in the path of a call",
    useCase: "Federated login for agents: the resource accepts a login the PS ran",
  },
  {
    id: "ps-asserted",
    label: "PS authorization",
    parties: "Three-Party",
    color: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
    href: "/access/ps-asserted",
    participants: ["Agent", "Resource", "Person Server"],
    knows: "person and consented scope",
    establishedBy: "the person server",
    flow: [
      { arrow: "Agent → PS", note: "Person token for this resource" },
      { arrow: "Agent → Resource", note: "POST authorization_endpoint w/ person token" },
      { arrow: "Resource → Agent", note: "Resource token (aud=PS) — copies ps, sub, person_token_jti" },
      { arrow: "Agent → PS", note: "POST auth_token_endpoint w/ resource token" },
      { arrow: "PS → Agent", note: "Auth token (iss=PS, dwk=aauth-person.json)" },
      { arrow: "Agent → Resource", note: "Present auth token → 200" },
    ],
    tokens: ["aa-agent+jwt", "aa-person+jwt", "aa-resource+jwt", "aa-auth+jwt (from PS)"],
    infra: "Person Server (no Access Server)",
    useCase: "Resource accepts identity claims and consented scope from any PS",
  },
  {
    id: "federated",
    label: "Federated authorization",
    parties: "Four-Party",
    color: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/30",
    href: "/access/federated",
    participants: ["Agent", "Resource", "Person Server", "Access Server"],
    knows: "person and policy verdict",
    establishedBy: "the access server",
    flow: [
      { arrow: "Agent → PS", note: "Person token for this resource" },
      { arrow: "Agent → Resource", note: "POST authorization_endpoint w/ person token" },
      { arrow: "Resource → Agent", note: "Resource token (aud=AS)" },
      { arrow: "Agent → PS", note: "POST auth_token_endpoint w/ resource token" },
      { arrow: "PS → AS", note: "Federates: resource_token + agent_token (signed)" },
      { arrow: "AS → PS → Agent", note: "Auth token (iss=AS, dwk=aauth-access.json)" },
      { arrow: "Agent → Resource", note: "Present auth token → 200" },
    ],
    tokens: ["aa-agent+jwt", "aa-person+jwt", "aa-resource+jwt", "aa-auth+jwt (from AS)"],
    infra: "Person Server + Access Server, PS-AS trust (pre-established or dynamic)",
    useCase: "Cross-domain access with the resource's AS enforcing policy",
  },
];

export default function AccessComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Resource Access</p>
        <h1 className="text-3xl font-bold">Resource Access Mode Comparison</h1>
        <p className="text-muted-foreground max-w-3xl">
          AAuth defines five resource access modes, sorted by what the resource ends up knowing
          and which party established it — not by how much of the protocol they use. The protocol
          works in every mode, and adoption does not require coordination between parties. A
          resource MAY apply different modes to different endpoints. Agent governance (missions,
          permission, audit, interaction relay) is an orthogonal layer that any agent with a PS can
          add on top of any mode.
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

            <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/20 px-3 py-2 text-xs">
              <div>
                <p className="text-muted-foreground/60 text-[10px] uppercase tracking-wider mb-0.5">Resource knows</p>
                <p className="text-foreground/80">{m.knows}</p>
              </div>
              <div>
                <p className="text-muted-foreground/60 text-[10px] uppercase tracking-wider mb-0.5">Established by</p>
                <p className="text-foreground/80">{m.establishedBy}</p>
              </div>
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
          Each mode is independently deployable. A resource can start by just verifying the
          agent&apos;s signature (agent identity), later accept a login the PS ran (person identity),
          run its own flow instead (resource-managed), take consented scope from any PS
          (PS authorization), or deploy its own access server (federated) — without changing the
          agent&apos;s signing approach. What varies is what the resource challenges for and which
          party mints the eventual auth token. Resource-managed and person identity reach the same
          destination by different routes: in the first the resource runs its own login, in the
          second it accepts one the person server ran. A resource serving on identity alone
          challenges for <code className="font-mono">auth-token</code> only at the operations that
          need more, and keeps serving the rest on the person token.
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="text-green-600 dark:text-green-400">Agent identity</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-cyan-600 dark:text-cyan-400">Resource-managed</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-sky-600 dark:text-sky-400">Person identity</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-purple-600 dark:text-purple-400">PS authorization</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-orange-600 dark:text-orange-400">Federated authorization</span>
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
