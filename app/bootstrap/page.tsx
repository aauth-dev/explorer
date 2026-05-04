import { GitBranch, ArrowRight } from "lucide-react";
import Link from "next/link";

const BOOTSTRAP_PROFILES = [
  {
    title: "Web App",
    desc: "Agent runs in the browser; agent provider runs separately. Uses WebAuthn for device attestation at bootstrap and renewal.",
    href: "/bootstrap/web-app",
  },
  {
    title: "Mobile (iOS)",
    desc: "Agent runs on iOS with an enclave-protected key. Uses App Attest at bootstrap; enclave jkt-jwt for renewal.",
    href: "/bootstrap/ios",
  },
  {
    title: "Mobile (Android)",
    desc: "Agent runs on Android with a StrongBox-backed key. Uses Play Integrity at bootstrap; enclave jkt-jwt for renewal.",
    href: "/bootstrap/android",
  },
  {
    title: "Server / Workload",
    desc: "Agent runs as a server workload (VM, container, serverless). Uses platform attestation (AWS Nitro, GCP, Azure) for automated bootstrap.",
    href: "/bootstrap/server-workload",
  },
  {
    title: "Self-Hosted",
    desc: "Agent and agent provider co-located under a user-controlled domain. Self-issues agent tokens; PS binding is optional.",
    href: "/bootstrap/self-hosted",
  },
];

const RENEWAL_PROFILES = [
  {
    title: "Mobile Renewal (jkt-jwt)",
    desc: "Token renewal without PS involvement. The durable enclave key signs a jkt-jwt chaining to a new ephemeral key. Agent provider verifies by thumbprint — no user interaction, empty request body.",
    href: "/bootstrap/renewal-mobile",
  },
  {
    title: "Web App Renewal (WebAuthn)",
    desc: "Token renewal without PS involvement. Agent fetches a fresh challenge, produces a WebAuthn assertion via navigator.credentials.get(), and POSTs with a new ephemeral key. Agent provider verifies by credential rawId.",
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
          <span>AAuth Bootstrap — draft-hardt-aauth-bootstrap</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Bootstrap</h1>
        <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
          The ceremony by which an agent becomes bound to a person at their Person Server.
          Bootstrap establishes the{" "}
          <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">
            (ps_url, user_sub) → aauth:local@domain
          </code>{" "}
          binding that subsequent AAuth protocol flows depend on.
        </p>
      </div>

      {/* What bootstrap does */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold">What bootstrap establishes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {[
            {
              label: "Identity binding",
              desc: "The PS records which aauth:local@domain identity belongs to the user at this agent provider.",
              color: "text-violet-400",
            },
            {
              label: "Device credential",
              desc: "A WebAuthn credential ID (web) or enclave key thumbprint (mobile) tied to the binding for credential renewal.",
              color: "text-blue-400",
            },
            {
              label: "Agent token",
              desc: "The agent provider issues an agent_token bound to an ephemeral signing key. No scope or identity claims — those come later via the standard three-party flow.",
              color: "text-green-400",
            },
          ].map(({ label, desc, color }) => (
            <div key={label} className="space-y-1.5">
              <p className={`text-xs font-semibold ${color}`}>{label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bootstrap profiles */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Bootstrap profiles</h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            The same ceremony adapts to several deployment shapes. Interactive walkthroughs are
            coming soon.
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
      </section>

      {/* Renewal profiles */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Token renewal</h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Agent tokens expire (max 24h). Renewal uses the device credential established at bootstrap
            to issue a fresh token — without re-involving the PS.
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
          <p className="text-sm font-medium">Bootstrap is an extension to the AAuth Protocol</p>
          <p className="text-xs text-muted-foreground">
            After bootstrap, agents use the standard three-party flow to obtain identity claims and
            resource access.
          </p>
        </div>
        <Link
          href="/access/ps-managed"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          PS-Managed flow
          <ArrowRight className="h-3 w-3 opacity-70" />
        </Link>
      </section>
    </div>
  );
}
