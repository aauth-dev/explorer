"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Scenario } from "@/lib/types";
import { useScenarioStore } from "@/lib/store";
import { SequenceDiagram } from "@/components/core/SequenceDiagram";
import { JWTViewer } from "@/components/core/JWTViewer";
import { HeaderInspector } from "@/components/core/HeaderInspector";
import { SignatureVisualizer } from "@/components/core/SignatureVisualizer";
import { StepController } from "@/components/core/StepController";
import { TokenFlowDiagram } from "@/components/core/TokenFlowDiagram";
import { DeferredResponseTimeline } from "@/components/core/DeferredResponseTimeline";
import { MissionBlobViewer } from "@/components/core/MissionBlobViewer";
import { S256ChainVisualization } from "@/components/core/S256ChainVisualization";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS = {
  signing: "text-blue-400 bg-blue-500/10",
  access: "text-green-400 bg-green-500/10",
  missions: "text-purple-400 bg-purple-500/10",
  advanced: "text-orange-400 bg-orange-500/10",
};

const DEFAULT_DETAILS_WIDTH_PX = 475;
const MIN_DETAILS_WIDTH_PX = 260;

function getDetailsWidthBounds() {
  if (typeof window === "undefined") {
    return { min: MIN_DETAILS_WIDTH_PX, max: DEFAULT_DETAILS_WIDTH_PX };
  }
  const vw = window.innerWidth;
  // Leave room for sidebar (~72–288px), padding, and a usable diagram strip.
  const max = Math.min(880, Math.max(MIN_DETAILS_WIDTH_PX, Math.floor(vw * 0.48)));
  return { min: MIN_DETAILS_WIDTH_PX, max };
}

interface ScenarioPageProps {
  scenario: Scenario;
}

export function ScenarioPage({ scenario }: ScenarioPageProps) {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [detailsPanelWidthPx, setDetailsPanelWidthPx] = useState(DEFAULT_DETAILS_WIDTH_PX);
  const [isLg, setIsLg] = useState(false);
  const resizeStartRef = useRef<{ pointerId: number; startX: number; startW: number } | null>(null);
  const detailsWidthRef = useRef(detailsPanelWidthPx);
  const { currentStep, setCurrentStep, reset, activeVariant, setActiveVariant } = useScenarioStore();

  useEffect(() => {
    detailsWidthRef.current = detailsPanelWidthPx;
  }, [detailsPanelWidthPx]);

  useEffect(() => {
    reset();
  }, [scenario.id, reset]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsLg(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!isLg) return;
    const clamp = () => {
      const { min, max } = getDetailsWidthBounds();
      setDetailsPanelWidthPx((w) => Math.min(max, Math.max(min, w)));
    };
    window.addEventListener("resize", clamp);
    clamp();
    return () => window.removeEventListener("resize", clamp);
  }, [isLg]);

  const onDetailsResizePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isLg) return;
    e.preventDefault();
    const target = e.currentTarget;
    const pointerId = e.pointerId;
    target.setPointerCapture(pointerId);
    resizeStartRef.current = {
      pointerId,
      startX: e.clientX,
      startW: detailsWidthRef.current,
    };
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      const start = resizeStartRef.current;
      if (!start) return;
      const dx = ev.clientX - start.startX;
      const { min, max } = getDetailsWidthBounds();
      // Handle is on the left edge of the panel: move right → narrower, move left → wider.
      setDetailsPanelWidthPx(Math.min(max, Math.max(min, start.startW - dx)));
    };

    const cleanup = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      resizeStartRef.current = null;
      document.body.style.userSelect = prevUserSelect;
      try {
        target.releasePointerCapture(pointerId);
      } catch {
        /* capture already released */
      }
    };

    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      cleanup();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }, [isLg]);

  const onDetailsResizeDoubleClick = useCallback((e: React.MouseEvent) => {
    if (!isLg) return;
    e.preventDefault();
    const { min, max } = getDetailsWidthBounds();
    const w = Math.min(max, Math.max(min, DEFAULT_DETAILS_WIDTH_PX));
    setDetailsPanelWidthPx(w);
  }, [isLg]);

  const variantData =
    activeVariant === "interactive" && scenario.interactive
      ? scenario.interactive
      : null;

  const participants = variantData?.participants ?? scenario.participants;
  const steps = variantData?.steps ?? scenario.steps;
  const description = variantData?.description ?? scenario.description;
  const tokenFlow = variantData?.token_flow ?? scenario.token_flow;
  const deferredTimeline = variantData?.deferred_timeline ?? scenario.deferred_timeline;

  const step = steps[currentStep];
  const stepLabels = steps.map((s) => s.label);

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="border-b border-border px-6 py-4 shrink-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-[10px] font-semibold rounded px-2 py-0.5 uppercase tracking-wider",
                  CATEGORY_COLORS[scenario.category]
                )}
              >
                {scenario.category}
              </span>
              {scenario.demo_phase && (
                <span className="text-[10px] font-mono text-muted-foreground">
                  Phase {scenario.demo_phase}
                </span>
              )}
              {/* Autonomous / With User Approval toggle */}
              {scenario.interactive && (
                <div className="ml-2 flex items-center rounded-md border border-border bg-muted/30 p-0.5 text-[11px] font-medium">
                  <button
                    onClick={() => setActiveVariant("autonomous")}
                    className={cn(
                      "rounded px-2.5 py-0.5 transition-colors",
                      activeVariant === "autonomous"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Autonomous
                  </button>
                  <button
                    onClick={() => setActiveVariant("interactive")}
                    className={cn(
                      "rounded px-2.5 py-0.5 transition-colors",
                      activeVariant === "interactive"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    With User Approval
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-xl font-bold">{scenario.title}</h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
          {scenario.spec_section && (
            <a
              href="#"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              {scenario.spec_section}
            </a>
          )}
        </div>
      </div>

      {/* Main content: diagram is primary (flex-1); details use fixed width + collapsible */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* Sequence diagram + step controller — grows with viewport */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-border lg:border-b-0">
          <div className="min-h-0 flex-1 overflow-auto p-6">
            <SequenceDiagram
              participants={participants}
              steps={steps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />
          </div>

          {/* Step info */}
          {step && (
            <div className="shrink-0 overflow-hidden border-t border-border bg-muted/10 px-4 py-3">
              <div className="mb-2 flex min-w-0 items-center gap-2">
                <span className="min-w-0 break-all font-mono text-[10px] text-muted-foreground">
                  {step.method} {step.url}
                </span>
                <span
                  className={cn(
                    "ml-auto shrink-0 font-mono text-[10px] font-bold",
                    step.response_status < 300
                      ? "text-green-400"
                      : step.response_status < 400
                        ? "text-blue-400"
                        : "text-amber-400"
                  )}
                >
                  {step.response_status}
                </span>
              </div>
              {step.annotations.length > 0 && (
                <div className="space-y-1">
                  {step.annotations.map((note, i) => (
                    <p key={i} className="text-xs leading-relaxed text-muted-foreground">
                      {note}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="shrink-0 border-t border-border p-4">
            <StepController totalSteps={steps.length} stepLabels={stepLabels} />
          </div>
        </div>

        {/* Collapsed: slim expand control (desktop) + bar (mobile) */}
        {!detailsOpen && (
          <>
            <div className="hidden shrink-0 border-l border-border bg-muted/20 lg:flex">
              <button
                type="button"
                onClick={() => setDetailsOpen(true)}
                className="flex w-10 flex-col items-center justify-center gap-1 border-border py-4 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Show request and response details"
                title="Show details"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            <div className="shrink-0 border-t border-border px-4 py-2 lg:hidden">
              <button
                type="button"
                onClick={() => setDetailsOpen(true)}
                className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Show request and response details
              </button>
            </div>
          </>
        )}

        {/* Right: Detail panels — resizable width on large screens */}
        {detailsOpen && (
          <div
            className={cn(
              "flex min-h-0 w-full shrink-0 flex-col border-t border-border lg:min-w-0 lg:flex-row lg:border-l lg:border-t-0"
            )}
            style={isLg ? { width: `${detailsPanelWidthPx}px` } : undefined}
          >
            {/* Drag handle (desktop): narrow hit target + visible line */}
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize details panel"
              title="Drag to resize. Double-click to reset."
              tabIndex={0}
              onPointerDown={onDetailsResizePointerDown}
              onDoubleClick={onDetailsResizeDoubleClick}
              onKeyDown={(e) => {
                if (!isLg) return;
                const step = 16;
                const { min, max } = getDetailsWidthBounds();
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  setDetailsPanelWidthPx((w) => Math.max(min, w - step));
                }
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  setDetailsPanelWidthPx((w) => Math.min(max, w + step));
                }
                if (e.key === "Home") {
                  e.preventDefault();
                  const { min: lo, max: hi } = getDetailsWidthBounds();
                  setDetailsPanelWidthPx(Math.min(hi, Math.max(lo, DEFAULT_DETAILS_WIDTH_PX)));
                }
                if (e.key === "End") {
                  e.preventDefault();
                  setDetailsPanelWidthPx(min);
                }
              }}
              className={cn(
                "group relative hidden w-3 shrink-0 touch-none select-none lg:flex lg:flex-col",
                "cursor-col-resize items-stretch justify-center",
                "hover:bg-primary/5",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-muted-foreground/50"
              )}
            >
              <div className="pointer-events-none absolute inset-y-3 left-1/2 w-px -translate-x-1/2 rounded-full bg-border group-hover:bg-primary/60" />
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/20 px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground">Request / response</span>
                <button
                  type="button"
                  onClick={() => setDetailsOpen(false)}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Hide request and response details"
                  title="Hide details"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
              {step && (
                <motion.div
                  key={`${activeVariant}-${currentStep}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {tokenFlow && tokenFlow.length > 0 && (
                    <TokenFlowDiagram
                      flows={tokenFlow}
                      participants={participants}
                      currentStep={currentStep}
                      onStepSelect={setCurrentStep}
                    />
                  )}

                  {deferredTimeline && (
                    <DeferredResponseTimeline
                      timeline={deferredTimeline}
                      currentStep={currentStep}
                      onStepSelect={setCurrentStep}
                    />
                  )}

                  {scenario.mission_blob && <MissionBlobViewer mission={scenario.mission_blob} />}

                  {scenario.s256_chain && scenario.s256_chain.length > 0 && (
                    <S256ChainVisualization links={scenario.s256_chain} />
                  )}

                  <HeaderInspector
                    method={step.method}
                    url={step.url}
                    requestHeaders={step.request_headers}
                    responseHeaders={step.response_headers}
                    requestBody={step.request_body}
                    responseBody={step.response_body}
                    responseStatus={step.response_status}
                  />

                  {step.signature && <SignatureVisualizer signature={step.signature} />}

                  {step.tokens.length > 0 && (
                    <div className="space-y-4">
                      {step.tokens.map((token, i) => (
                        <JWTViewer key={i} token={token} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
