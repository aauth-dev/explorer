"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Default width for the request/response details pane (px). */
export const DEFAULT_DETAILS_PANEL_WIDTH_PX = 475;

interface ScenarioState {
  currentStep: number;
  isPlaying: boolean;
  playSpeed: number; // ms between steps
  expandedPanel: "headers" | "payload" | "jwt" | "signature" | null;
  selectedTokenIndex: number | null;
  activeVariant: "autonomous" | "interactive";
  /** Right details panel width; persisted across scenarios and reloads. */
  detailsPanelWidthPx: number;

  setCurrentStep: (step: number) => void;
  nextStep: (maxStep: number) => void;
  prevStep: () => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaySpeed: (speed: number) => void;
  setExpandedPanel: (panel: ScenarioState["expandedPanel"]) => void;
  setSelectedTokenIndex: (index: number | null) => void;
  setActiveVariant: (variant: "autonomous" | "interactive") => void;
  setDetailsPanelWidthPx: (widthOrUpdater: number | ((prev: number) => number)) => void;
  reset: () => void;
}

export const useScenarioStore = create<ScenarioState>()(
  persist(
    (set) => ({
      currentStep: 0,
      isPlaying: false,
      playSpeed: 1800,
      expandedPanel: null,
      selectedTokenIndex: null,
      activeVariant: "autonomous",
      detailsPanelWidthPx: DEFAULT_DETAILS_PANEL_WIDTH_PX,

      setCurrentStep: (step) => set({ currentStep: step, expandedPanel: null, selectedTokenIndex: null }),
      nextStep: (maxStep) =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, maxStep),
          expandedPanel: null,
          selectedTokenIndex: null,
        })),
      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
          expandedPanel: null,
          selectedTokenIndex: null,
        })),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setPlaySpeed: (speed) => set({ playSpeed: speed }),
      setExpandedPanel: (panel) => set({ expandedPanel: panel }),
      setSelectedTokenIndex: (index) => set({ selectedTokenIndex: index }),
      setActiveVariant: (variant) =>
        set({ activeVariant: variant, currentStep: 0, expandedPanel: null, selectedTokenIndex: null }),
      setDetailsPanelWidthPx: (widthOrUpdater) =>
        set((state) => ({
          detailsPanelWidthPx:
            typeof widthOrUpdater === "function"
              ? widthOrUpdater(state.detailsPanelWidthPx)
              : widthOrUpdater,
        })),
      reset: () =>
        set({
          currentStep: 0,
          isPlaying: false,
          expandedPanel: null,
          selectedTokenIndex: null,
          activeVariant: "autonomous",
        }),
    }),
    {
      name: "aauth-explorer-scenario",
      partialize: (state) => ({
        detailsPanelWidthPx: state.detailsPanelWidthPx,
      }),
    }
  )
);
