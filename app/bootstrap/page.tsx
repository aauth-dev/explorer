import { GitBranch, ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";

const BOOTSTRAP_PROFILES = [
  {
    title: "Web App",
    desc: "Agent runs in the browser. Non-extractable WebCrypto durable key in IndexedDB; ephemeral key rotated per agent-token issuance. WebAuthn is an optional layer.",
    href: "/bootstrap/web-app",
  },
  {
    title: "Mobile (iOS)",
    desc: "Agent runs on iOS with a Secure Enclave durable key. Optional App Attest at enrollment.",
    href: "/bootstrap/ios",
  },
  {
    title: "Mobile (Android)",
    desc: "Agent runs on Android with a StrongBox / Android Keystore durable key. Optional Play Integrity at enrollment.",
    href: "/bootstrap/android",
  },
  {
    title: "Self-Hosted",
    desc: "Agent runs under a user-controlled domain and acts as its own agent provider. Self-issues agent tokens signed by a JWKS-published key.",
    href: "/bootstrap/self-hosted",
  },
];

const RENEWAL_PROFILES = [
  {
    title: "Two-Key Refresh (mobile)",
    desc: "Refresh chains a fresh ephemeral key to the durable key via the jkt-jwt scheme. The durable key signs only the naming JWT; the ephemeral key signs HTTP messages.",
    href: "/bootstrap/renewal-mobile",
  },
  {
    title: "Two-Key Refresh (web)",
    desc: "Same pattern on web. A WebAuthn assertion can optionally be required at high-assurance refreshes.",
    href: "/bootstrap/renewal-web-app",
  },
];

export default function BootstrapPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-14">
      {/* Hero */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <GitBranch className="h-3.5 w-3.5" />
          <span>AAuth Bootstrap — draft-hardt-aauth-bootstrap-01 (informational)</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Bootstrap</h1>
        <p className="max-w-3xl text-lg text-muted-foreground leading-relaxed">
          The AP-side ceremony by which an instance of an agent acquires an agent token. The agent
          generates a signing key, presents whatever evidence the agent provider requires, and
          receives an{" "}
          <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">aa-agent+jwt</code>{" "}
          whose <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">cnf.jwk</code>{" "}
          is bound to that key and whose{" "}
          <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">sub</code> is an{" "}
          <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">aauth:local@domain</code>{" "}
          identifier the AP has chosen.
        </p>
      </div>

      {/* Status banner */}
      <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
        <div className="space-y-1.5 text-sm">
          <p className="font-medium text-amber-100">Informational — not normative protocol</p>
          <p className="text-muted-foreground leading-relaxed">
            As of <code className="font-mono bg-muted px-1 py-px rounded text-xs">-01</code>, the
            Bootstrap document is informational guidance for agent provider implementers. The
            previously-normative PS <code className="font-mono bg-muted px-1 py-px rounded text-xs">/bootstrap</code> endpoint,{" "}
            <code className="font-mono bg-muted px-1 py-px rounded text-xs">bootstrap_token</code>,{" "}
            <code className="font-mono bg-muted px-1 py-px rounded text-xs">aa-bootstrap+jwt</code>{" "}
            type, and PS bootstrap announcement have been removed. PS-side binding of an agent to a
            person now happens lazily on the agent&apos;s first interaction with the PS. The
            scenarios linked below pre-date this rewrite and are kept here for reference; they
            depict mechanisms that are no longer part of the spec.
          </p>
        </div>
      </section>

      {/* What bootstrap is and isn't */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold">What bootstrap is — and is not</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-violet-400">Bootstrap is</p>
            <ul className="text-xs text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
              <li>The AP-side ceremony that produces an agent token</li>
              <li>Per-platform key handling (durable + ephemeral)</li>
              <li>Optional platform attestation (WebAuthn, App Attest, Play Integrity)</li>
              <li>Agent identifier strategy at the AP</li>
              <li>Refresh patterns for replacing expired agent tokens</li>
            </ul>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground/80">Bootstrap is not</p>
            <ul className="text-xs text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
              <li>The user-to-agent binding (the PS does this lazily on first interaction)</li>
              <li>Authorization — bootstrap conveys no scope or resource permission</li>
              <li>An identity-claim flow — claims come later via the standard flows</li>
              <li>A one-size-fits-all ceremony — web, mobile, and self-hosted differ</li>
              <li>Normative protocol — APs may use other approaches</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Two-key pattern */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Two-key pattern</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-blue-400">Durable key</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Lifetime spans the agent install. Hardware-bound where the platform supports it
              (Secure Enclave, StrongBox, TPM). Presented only to the AP at refresh; never signs
              requests to PSes, resources, or ASes.
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-green-400">Ephemeral key</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generated fresh per agent-token issuance. Public part appears in{" "}
              <code className="font-mono bg-muted px-1 py-px rounded">agent_token.cnf.jwk</code>.
              Signs HTTP messages for the agent token&apos;s lifetime, then is discarded on next
              refresh.
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This bounds the blast radius of an ephemeral-key leak to one agent token&apos;s lifetime
          and narrows the durable key&apos;s attack surface to the AP refresh path. APs may also use
          a single durable key for all signatures — receivers cannot distinguish the two patterns.
          Self-hosted agents use a single key (the JWKS-published key serves both roles).
        </p>
      </section>

      {/* Bootstrap profiles */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Per-platform enrollment sketches</h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            The same idea adapts to several deployment shapes. The scenarios below were written
            against the earlier draft — see the banner above.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {BOOTSTRAP_PROFILES.map((profile) => (
            <Link
              key={profile.title}
              href={profile.href}
              className="rounded-xl border border-border bg-card p-5 flex items-start justify-between gap-4 transition-colors hover:bg-accent/50"
            >
              <div className="space-y-1 min-w-0">
                <h3 className="text-sm font-semibold">{profile.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.desc}</p>
              </div>
              <ArrowRight className="shrink-0 h-4 w-4 text-muted-foreground mt-0.5" />
            </Link>
          ))}
        </div>
        <p className="text-xs text-muted-foreground/70 italic">
          Desktop apps and headless workloads are marked TBD in the current draft and are not
          covered here.
        </p>
      </section>

      {/* Renewal profiles */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Token refresh</h2>
          <p className="text-sm text-muted-foreground max-w-3xl">
            Agent tokens are typically 1 hour, up to a 24-hour ceiling. Every refresh is the
            AP&apos;s chance to re-check device posture, attestation freshness, and account status
            before issuing a new token. The durable key chains a fresh ephemeral key via the{" "}
            <code className="font-mono bg-muted px-1 py-px rounded text-xs">jkt-jwt</code> scheme.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {RENEWAL_PROFILES.map((profile) => (
            <Link
              key={profile.title}
              href={profile.href}
              className="rounded-xl border border-border bg-card p-5 flex items-start justify-between gap-4 transition-colors hover:bg-accent/50"
            >
              <div className="space-y-1 min-w-0">
                <h3 className="text-sm font-semibold">{profile.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.desc}</p>
              </div>
              <ArrowRight className="shrink-0 h-4 w-4 text-muted-foreground mt-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* Link back to protocol */}
      <section className="rounded-xl border border-dashed border-border/70 bg-muted/10 p-5 flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Bootstrap produces an agent identity. The PS binds it to a person.</p>
          <p className="text-xs text-muted-foreground">
            After bootstrap, the PS attaches the agent to a user lazily on first interaction.
            Resources can then issue resource tokens targeting the agent&apos;s PS for identity and
            consent.
          </p>
        </div>
        <Link
          href="/access/ps-asserted"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          PS-Asserted flow
          <ArrowRight className="h-3 w-3 opacity-70" />
        </Link>
      </section>
    </div>
  );
}
