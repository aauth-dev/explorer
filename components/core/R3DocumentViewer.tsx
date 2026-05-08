"use client";

import { FileJson, AlertTriangle, Eye, Info } from "lucide-react";
import { R3Document } from "@/lib/types";

const VOCAB_LABELS: Record<string, string> = {
  "urn:aauth:vocabulary:mcp": "MCP",
  "urn:aauth:vocabulary:openapi": "OpenAPI",
  "urn:aauth:vocabulary:grpc": "gRPC",
  "urn:aauth:vocabulary:graphql": "GraphQL",
  "urn:aauth:vocabulary:asyncapi": "AsyncAPI",
  "urn:aauth:vocabulary:wsdl": "WSDL",
  "urn:aauth:vocabulary:odata": "OData",
};

function formatOperation(op: Record<string, unknown>, vocabulary: string): string {
  if (vocabulary === "urn:aauth:vocabulary:mcp" && op.tool) return `tool: ${op.tool}`;
  if (vocabulary === "urn:aauth:vocabulary:openapi" && op.operationId) return `operationId: ${op.operationId}`;
  if (vocabulary === "urn:aauth:vocabulary:grpc" && op.method) return `method: ${op.method}`;
  if (vocabulary === "urn:aauth:vocabulary:graphql" && op.operation) return `${op.type}: ${op.operation}`;
  if (vocabulary === "urn:aauth:vocabulary:asyncapi" && op.operationId) return `${op.action}: ${op.operationId}`;
  if (vocabulary === "urn:aauth:vocabulary:wsdl" && op.operation) return `operation: ${op.operation}`;
  if (vocabulary === "urn:aauth:vocabulary:odata" && op.operation) return `operation: ${op.operation}`;
  return Object.entries(op).map(([k, v]) => `${k}: ${v}`).join(", ");
}

interface R3DocumentViewerProps {
  document: R3Document;
}

export function R3DocumentViewer({ document }: R3DocumentViewerProps) {
  const vocabLabel = VOCAB_LABELS[document.vocabulary] ?? document.vocabulary;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border bg-muted/20 px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileJson className="h-3.5 w-3.5 text-teal-400" />
            <span className="text-xs font-semibold">R3 Document</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
              {vocabLabel}
            </span>
            {document.version && (
              <span className="text-[10px] text-muted-foreground/60 font-mono">v{document.version}</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Vocabulary
          </p>
          <code className="text-[11px] font-mono text-teal-300 bg-teal-500/5 border border-teal-500/20 rounded px-2 py-1 block break-all">
            {document.vocabulary}
          </code>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Operations ({document.operations.length})
          </p>
          <div className="space-y-1">
            {document.operations.map((op, i) => (
              <div key={i} className="flex items-center gap-2 rounded bg-muted/20 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" />
                <code className="text-[11px] font-mono text-foreground/80">
                  {formatOperation(op, document.vocabulary)}
                </code>
              </div>
            ))}
          </div>
        </div>

        {document.display && (
          <div className="space-y-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Consent Display
            </p>

            <div className="rounded-lg border border-border bg-muted/10 p-3">
              <div className="flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold text-blue-400">Summary</p>
                  <p className="text-xs text-foreground leading-relaxed">{document.display.summary}</p>
                </div>
              </div>
            </div>

            {document.display.implications && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold text-amber-400">Implications</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{document.display.implications}</p>
                  </div>
                </div>
              </div>
            )}

            {document.display.data_accessed && (
              <div className="rounded-lg border border-border bg-muted/10 p-3">
                <div className="flex items-start gap-2">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold text-muted-foreground">Data Accessed</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{document.display.data_accessed}</p>
                  </div>
                </div>
              </div>
            )}

            {document.display.irreversible && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold text-red-400">Irreversible</p>
                    <p className="text-xs text-red-300/80 leading-relaxed">{document.display.irreversible}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
