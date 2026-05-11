"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight, Radio, Lock, FileText, Zap, Layers, X, Key, GitBranch, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface NavSection {
  title: string;
  icon: React.ElementType;
  color: string;
  items: NavItem[];
  footerNote?: { label: string; href: string };
}

type Tab = "protocol" | "signing" | "bootstrap";

const TABS: { id: Tab; label: string; defaultHref: string }[] = [
  { id: "protocol", label: "Protocol", defaultHref: "/" },
  { id: "signing", label: "Signing", defaultHref: "/foundations/profile" },
];

function getActiveTab(pathname: string): Tab {
  if (pathname.startsWith("/bootstrap")) return "bootstrap";
  if (
    pathname.startsWith("/foundations") ||
    (pathname.startsWith("/signing") && !pathname.startsWith("/signing/agent-tokens"))
  )
    return "signing";
  return "protocol";
}

const PROTOCOL_NAV: NavSection[] = [
  {
    title: "Agent Identity",
    icon: Key,
    color: "text-blue-400",
    items: [{ label: "Agent Tokens (sig=jwt)", href: "/signing/agent-tokens" }],
    footerNote: { label: "Full signing reference →", href: "/foundations/profile" },
  },
  {
    title: "Resource Access",
    icon: Lock,
    color: "text-green-400",
    items: [
      { label: "Identity-Based", href: "/access/identity-based" },
      { label: "Resource-Managed (2-party)", href: "/access/resource-managed" },
      { label: "PS-Asserted (3-party)", href: "/access/ps-asserted" },
      { label: "Federated (4-party)", href: "/access/federated" },
      { label: "Compare Modes", href: "/access/compare" },
    ],
  },
  {
    title: "Missions — experimental",
    icon: FileText,
    color: "text-purple-400",
    items: [
      { label: "Proposal & Approval", href: "/missions/lifecycle" },
      { label: "Resource Access", href: "/missions/resource-access" },
      { label: "Out-of-Bounds Access", href: "/missions/out-of-bounds" },
      { label: "Completion", href: "/missions/completion" },
      { label: "Audit Endpoint", href: "/missions/audit" },
      { label: "End-to-End Lifecycle", href: "/missions/end-to-end" },
      { label: "With vs Without Missions", href: "/missions/compare" },
    ],
  },
  {
    title: "Advanced Patterns",
    icon: Zap,
    color: "text-orange-400",
    items: [
      { label: "Call Chaining", href: "/advanced/call-chaining" },
      { label: "Clarification Chat", href: "/advanced/clarification" },
      { label: "Interaction Chaining", href: "/advanced/interaction-chaining" },
      { label: "User Delegation (Deferred Auth)", href: "/access/user-delegation" },
    ],
  },
  {
    title: "Rich Resource Requests (R3) — experimental",
    icon: Database,
    color: "text-teal-400",
    items: [
      { label: "Vocabulary-Based Access", href: "/r3/vocabulary-basics" },
      { label: "Conditional Operations", href: "/r3/conditional-ops" },
      { label: "Content Addressing & Consent", href: "/r3/content-addressing" },
    ],
  },
];

const SIGNING_NAV: NavSection[] = [
  {
    title: "Foundations",
    icon: Layers,
    color: "text-cyan-400",
    items: [
      { label: "HTTP Signatures Profile", href: "/foundations/profile" },
      { label: "Signature-Key Schemes", href: "/foundations/schemes" },
      { label: "Error Model", href: "/foundations/errors" },
    ],
  },
  {
    title: "Message Signing",
    icon: Radio,
    color: "text-blue-400",
    items: [
      { label: "Pseudonymous (sig=hwk)", href: "/signing/pseudonymous" },
      { label: "Hardware-backed (sig=jkt-jwt)", href: "/signing/hardware-backed" },
      { label: "Agent Identity (sig=jwks_uri)", href: "/signing/identity" },
      { label: "Agent Tokens (sig=jwt)", href: "/signing/agent-tokens" },
      { label: "Compare Modes", href: "/signing/compare" },
    ],
  },
];

const BOOTSTRAP_NAV: NavSection[] = [
  {
    title: "Bootstrap",
    icon: GitBranch,
    color: "text-violet-400",
    items: [
      { label: "Overview", href: "/bootstrap" },
      { label: "Web App", href: "/bootstrap/web-app" },
      { label: "Mobile (iOS)", href: "/bootstrap/ios" },
      { label: "Mobile (Android)", href: "/bootstrap/android" },
      { label: "Self-Hosted", href: "/bootstrap/self-hosted" },
    ],
  },
  {
    title: "Renewal",
    icon: GitBranch,
    color: "text-violet-400",
    items: [
      { label: "Mobile (jkt-jwt)", href: "/bootstrap/renewal-mobile" },
      { label: "Web App (WebAuthn)", href: "/bootstrap/renewal-web-app" },
    ],
  },
];

const NAV_BY_TAB: Record<Tab, NavSection[]> = {
  protocol: PROTOCOL_NAV,
  signing: SIGNING_NAV,
  bootstrap: BOOTSTRAP_NAV,
};

function SidebarSection({
  section,
  defaultOpen,
}: {
  section: NavSection;
  defaultOpen: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(defaultOpen);
  const Icon = section.icon;
  const isActive = section.items.some(
    (i) => pathname === i.href || pathname.startsWith(i.href + "/")
  );

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", section.color)} />
        <span className="flex-1 text-left">{section.title}</span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        )}
      </button>

      {open && (
        <div className="mt-0.5 ml-4 border-l border-border pl-3 space-y-0.5">
          {section.items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
          {section.footerNote && (
            <Link
              href={section.footerNote.href}
              className="flex items-center px-2.5 py-1 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              {section.footerNote.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);
  const nav = NAV_BY_TAB[activeTab];

  return (
    <div className="flex h-full flex-col bg-sidebar border-r border-border">
      {onClose && (
        <div className="flex h-12 items-center justify-end px-2 border-b border-border shrink-0 lg:hidden">
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tab switcher */}
      <div className="px-3 pt-4 pb-2 shrink-0">
        <div className="flex rounded-lg bg-muted p-0.5 gap-0.5">
          {TABS.map((tab) => (
            <Link
              key={tab.id}
              href={activeTab === tab.id ? pathname : tab.defaultHref}
              className={cn(
                "flex-1 rounded-md px-2 py-1.5 text-xs font-medium text-center transition-colors",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-3">
        {nav.map((section) => {
          const defaultOpen = section.items.some(
            (i) => pathname === i.href || pathname.startsWith(i.href + "/")
          );
          return (
            <SidebarSection
              key={section.title}
              section={section}
              defaultOpen={defaultOpen || true}
            />
          );
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-4 py-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          SPEC.md reference ↗
        </a>
      </div>
    </div>
  );
}
