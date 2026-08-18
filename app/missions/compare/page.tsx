import Link from "next/link";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";

const S256 = "7SGTFsuKCcpYJwGRkVBi8vOc1Ssm7NdgnVaAruK87Rg";

const WITHOUT = {
  label: "Without Missions",
  color: "text-zinc-400",
  border: "border-zinc-700",
  headers: {
    request: {
      "Signature-Key": 'sig=jwt;jwt="eyJhbGc...person-token..."',
      "Signature-Input": 'sig=("@method" "@authority" "@path" "signature-key")',
      Signature: "sig=:base64url…:",
    },
    personToken: {
      iss: "https://ps.example",
      dwk: "aauth-person.json",
      aud: "https://api.example",
      sub: "8f14e45fceea167a5a36dedd4bea2543",
      cnf: { jwk: { kty: "OKP", crv: "Ed25519", x: "…", alg: "Ed25519" } },
      jti: "pt-32d653",
    },
    resourceToken: {
      iss: "https://api.example",
      aud: "https://as.example",
      ps: "https://ps.example",
      sub: "8f14e45fceea167a5a36dedd4bea2543",
      person_token_jti: "pt-32d653",
      agent_jkt: "tcP75aIbpvVmzZ0P…",
      scope: "read",
    },
    authToken: {
      iss: "https://as.example",
      aud: "https://api.example",
      ps: "https://ps.example",
      sub: "8f14e45fceea167a5a36dedd4bea2543",
      cnf: { jwk: { kty: "OKP", crv: "Ed25519", x: "…", alg: "Ed25519" } },
      scope: "read",
    },
  },
};

const WITH = {
  label: "With Missions",
  color: "text-purple-600 dark:text-purple-400",
  border: "border-purple-500/40",
  headers: {
    request: {
      "Signature-Key": 'sig=jwt;jwt="eyJhbGc...person-token..."',
      "AAuth-Capabilities": "interaction, clarification",
      "Signature-Input": 'sig=("@method" "@authority" "@path" "signature-key")',
      Signature: "sig=:base64url…:",
    },
    missionBlob: {
      approver: "https://ps.example",
      agent: "aauth:local@agent.example",
      approved_at: "2026-04-14T17:14:54Z",
      expires_at: "2026-05-14T17:14:54Z",
      description: "# Analyze Q2 Customer Feedback …",
      approved_tools: [
        { name: "FeedbackReader", description: "Read customer feedback records" },
        { name: "ReportWriter", description: "Write the summary report" },
      ],
      approved_resources: ["https://api.example"],
    },
    personToken: {
      iss: "https://ps.example",
      dwk: "aauth-person.json",
      aud: "https://api.example",
      sub: "8f14e45fceea167a5a36dedd4bea2543",
      cnf: { jwk: { kty: "OKP", crv: "Ed25519", x: "…", alg: "Ed25519" } },
      mission_s256: S256,
      jti: "pt-32d653",
    },
    resourceToken: {
      iss: "https://api.example",
      aud: "https://as.example",
      ps: "https://ps.example",
      sub: "8f14e45fceea167a5a36dedd4bea2543",
      person_token_jti: "pt-32d653",
      agent_jkt: "tcP75aIbpvVmzZ0P…",
      scope: "read",
      mission_s256: S256,
    },
    authToken: {
      iss: "https://as.example",
      aud: "https://api.example",
      ps: "https://ps.example",
      sub: "8f14e45fceea167a5a36dedd4bea2543",
      cnf: { jwk: { kty: "OKP", crv: "Ed25519", x: "…", alg: "Ed25519" } },
      scope: "read",
      mission_s256: S256,
    },
  },
};

const ADDITIONS = [
  { item: "mission_s256 named at the person token endpoint", with: true },
  { item: "mission_s256 claim in the person token", with: true },
  { item: "mission_s256 claim in the resource token (REQUIRED once the person token has one)", with: true },
  { item: "mission_s256 claim in the auth token", with: true },
  { item: "PS mission_endpoint for proposals, updates and completion", with: true },
  { item: "s256 verified against the decoded mission blob bytes", with: true },
  { item: "Mission log at the PS", with: true },
  { item: "Pre-approved tools and resources (optional)", with: true },
  { item: "Mission expiry caps every token's lifetime", with: true },
  { item: "Audit endpoint (requires a mission)", with: true },
  { item: "Person token before any resource token", with: true, without: true },
  { item: "HTTP Message Signatures", with: true, without: true },
  { item: "Resource token exchange", with: true, without: true },
  { item: "PS-AS federation (federated mode)", with: true, without: true },
  { item: "Proof-of-possession (cnf)", with: true, without: true },
  { item: "Permission and interaction endpoints", with: true, without: true },
];

function HeaderBlock({ data }: { data: Record<string, unknown> }) {
  return (
    <pre className="text-[10px] font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap break-all bg-muted/30 rounded-md p-3">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default function MissionsComparePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Missions</p>
        <h1 className="text-3xl font-bold">With vs Without Missions</h1>
        <p className="text-muted-foreground max-w-2xl">
          Missions are an optional governance layer that works with any resource access mode that
          has a Person Server. They add one claim — <code className="font-mono">mission_s256</code> —
          to every token in the chain, without changing the signing or federation mechanics. In -11
          a mission reaches a resource only inside a PS-issued token: the{" "}
          <code className="font-mono">AAuth-Mission</code> header and its IANA registration were
          both removed, so the mission is no longer something the agent asserts.
        </p>
      </div>

      {/* What missions add */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">What missions add</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Protocol element</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-zinc-400">Without</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-purple-600 dark:text-purple-400">With Missions</th>
              </tr>
            </thead>
            <tbody>
              {ADDITIONS.map((a, i) => (
                <tr key={a.item} className={`border-b border-border ${i % 2 ? "bg-muted/10" : ""}`}>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{a.item}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      {a.without
                        ? <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        : <XCircle className="h-4 w-4 text-zinc-700" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Token diff */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Token claim differences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[WITHOUT, WITH].map((mode) => (
            <div key={mode.label} className={`rounded-xl border ${mode.border} bg-card p-5 space-y-4`}>
              <p className={`font-semibold text-sm ${mode.color}`}>{mode.label}</p>

              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Request Headers</p>
                <HeaderBlock data={mode.headers.request as Record<string, unknown>} />
              </div>
              {"missionBlob" in mode.headers && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Mission Blob (from PS /mission approval)</p>
                  <HeaderBlock data={(mode.headers as { missionBlob: Record<string, unknown> }).missionBlob} />
                </div>
              )}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Person Token (aa-person+jwt payload)</p>
                <HeaderBlock data={mode.headers.personToken as Record<string, unknown>} />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Resource Token (aa-resource+jwt payload)</p>
                <HeaderBlock data={mode.headers.resourceToken as Record<string, unknown>} />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Auth Token (aa-auth+jwt payload)</p>
                <HeaderBlock data={mode.headers.authToken as Record<string, unknown>} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission lifecycle summary */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-semibold">Mission Lifecycle</h2>
        <ol className="space-y-2 text-sm text-muted-foreground">
          {[
            "Agent fetches PS well-known metadata to find mission_endpoint and person_token_endpoint.",
            'Agent POSTs a proposal: {"description": "# Task…", "tools": [...], "resources": ["https://api.example"]}.',
            "PS cannot approve without the person — returns 202 + AAuth-Requirement with an interaction URL.",
            "Person opens the interaction URL, reviews the description, tools and resources, and approves.",
            "Agent polls the pending URL; PS returns 200 with {s256, mission, capabilities, person_tokens}.",
            "Agent decodes `mission`, computes SHA-256 over the decoded bytes, and compares to `s256` (a SHOULD, not a requirement).",
            "person_tokens carries one mission-scoped person token per approved resource — each already stamped with mission_s256.",
            "Agent presents a person token at a resource; mission_s256 flows into the resource token and then the auth token.",
            "Work changes: agent POSTs {action: \'update\'} to {mission_endpoint}/{mission_s256}. The blob and mission_s256 are unchanged; the context the PS evaluates against is not.",
            "Agent proposes completion: {action: \'completion\', summary} at the same URL. The person accepts and the mission terminates, or asks follow-ups and it stays active.",
            "After termination, any PS request naming this mission_s256 returns mission_terminated with an optional termination_reason.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 text-[10px] font-mono text-muted-foreground/50 mt-1">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/missions/lifecycle" className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
            Mission Proposal Demo <ArrowRight className="h-3 w-3" />
          </Link>
          <Link href="/missions/end-to-end" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            End-to-End Lifecycle <ArrowRight className="h-3 w-3" />
          </Link>
          <Link href="/missions/completion" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            Mission Completion <ArrowRight className="h-3 w-3" />
          </Link>
          <Link href="/missions/permission" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            Permission Endpoint <ArrowRight className="h-3 w-3" />
          </Link>
          <Link href="/missions/audit" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            Audit Endpoint <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
