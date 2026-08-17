"use client";

import { FileText, Wrench } from "lucide-react";
import { MissionBlobData } from "@/lib/types";

interface MissionBlobViewerProps {
  mission: MissionBlobData;
}

export function MissionBlobViewer({ mission }: MissionBlobViewerProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border bg-muted/20 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold">{mission.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Description (Markdown)
            </p>
            <div className="mt-2 rounded-lg border border-border bg-muted/10 p-3">
              <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-muted-foreground">
                {mission.markdown}
              </pre>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Blob Members
            </p>
            <div className="mt-2 grid grid-cols-1 gap-1 text-[10px] font-mono text-muted-foreground">
              <div className="flex items-baseline gap-2 rounded bg-muted/30 px-2 py-1">
                <span className="shrink-0 text-muted-foreground/70">approver</span>
                <span className="break-all">{mission.approver}</span>
              </div>
              <div className="flex items-baseline gap-2 rounded bg-muted/30 px-2 py-1">
                <span className="shrink-0 text-muted-foreground/70">agent</span>
                <span className="break-all">{mission.agent}</span>
              </div>
              <div className="flex items-baseline gap-2 rounded bg-muted/30 px-2 py-1">
                <span className="shrink-0 text-muted-foreground/70">approved_at</span>
                <span className="break-all">{mission.approved_at}</span>
              </div>
              {mission.expires_at && (
                <div className="flex items-baseline gap-2 rounded bg-muted/30 px-2 py-1">
                  <span className="shrink-0 text-muted-foreground/70">expires_at</span>
                  <span className="break-all">{mission.expires_at}</span>
                </div>
              )}
              {mission.approved_resources && mission.approved_resources.length > 0 && (
                <div className="flex items-baseline gap-2 rounded bg-muted/30 px-2 py-1">
                  <span className="shrink-0 text-muted-foreground/70">approved_resources</span>
                  <span className="break-all">{mission.approved_resources.join(", ")}</span>
                </div>
              )}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground/70">
              The blob is what the digest covers. <span className="font-mono">approver</span> lives
              here and nowhere else — no token carries it.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mission Identifier
            </p>
            <div className="mt-2 space-y-1 text-[10px] font-mono text-muted-foreground">
              {mission.encoded && (
                <div className="rounded bg-muted/30 px-2 py-1">
                  <span className="text-muted-foreground/70">mission (base64url)</span>
                  <p className="mt-0.5 break-all">{mission.encoded}</p>
                </div>
              )}
              <div className="rounded bg-muted/30 px-2 py-1">
                <span className="text-muted-foreground/70">s256</span>
                <p className="mt-0.5 break-all text-foreground/80">{mission.s256}</p>
              </div>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground/70">
              s256 is not a blob member. It is BASE64URL(SHA-256()) of the bytes{" "}
              <span className="font-mono">mission</span> decodes to, returned alongside it so the
              agent can verify the digest covers an unambiguous byte sequence. It travels as the{" "}
              <span className="font-mono">mission_s256</span> claim of person, resource and auth
              tokens.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Approved Tools
            </p>
            <div className="mt-2 space-y-2">
              {mission.approved_tools.map((tool) => (
                <div key={tool.name} className="rounded-lg border border-border bg-muted/10 p-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-3.5 w-3.5 text-orange-300" />
                    <span className="text-xs font-medium">{tool.name}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {mission.capabilities && mission.capabilities.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                PS Capabilities
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {mission.capabilities.map((capability) => (
                  <span
                    key={capability}
                    className="rounded-full border border-border bg-card px-2 py-1 text-[10px] font-mono text-muted-foreground"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
