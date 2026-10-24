/**
 * GuideTutorialContext.jsx
 * Context and state provider for the interactive website onboarding guide tutorial,
 * searchable Page Explorer, Contextual Page Guidance, and Tour Completion engine.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GUIDE_STEPS, GUIDE_STORAGE_KEY } from "../data/guideTutorialSteps";
import { playSuccessChime, playCelebrationChime } from "../utils/audioCelebration";
import { APP_PAGES_REGISTRY, getPageById } from "../data/appPagesRegistry";

const GuideTutorialContext = createContext(null);

export function GuideTutorialProvider({ children, onNavigate, onSelectTopic }) {
  // Tour walkthrough state
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Modals state
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [explorerCategory, setExplorerCategory] = useState("all");
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Contextual Page Guidance state
  const [isContextualHelpOpen, setIsContextualHelpOpen] = useState(false);
  const [contextualHelpPage, setContextualHelpPage] = useState("home");

  // Preferences & Persistence
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasSeenTour, setHasSeenTour] = useState(true); // default true until mount check

  const markTourCompleted = useCallback(() => {
    try {
      localStorage.setItem(GUIDE_STORAGE_KEY, "true");
    } catch {
      // ignore storage errors
    }
    setHasSeenTour(true);
  }, []);

  // Sync route whenever tour step changes
  const syncRouteForStep = useCallback(
    (step) => {
      if (!step) return;
      if (step.screen === "lesson" && step.topicId && onSelectTopic) {
        onSelectTopic(step.topicId);
      } else if (step.screen && onNavigate) {
        onNavigate(step.screen);
      } else if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("py_navigate", {
            detail: { page: step.screen, topicId: step.topicId }
          })
        );
      }
    },
    [onNavigate, onSelectTopic]
  );

  const startTour = useCallback(
    (startIndex = 0) => {
      setIsWelcomeOpen(false);
      setIsExplorerOpen(false);
      setIsCompletionOpen(false);
      setIsContextualHelpOpen(false);
      const safeIndex = Math.max(0, Math.min(startIndex, GUIDE_STEPS.length - 1));
      setCurrentStepIndex(safeIndex);
      setIsTourActive(true);
      syncRouteForStep(GUIDE_STEPS[safeIndex]);
      if (soundEnabled) playSuccessChime();
    },
    [syncRouteForStep, soundEnabled]
  );

  // Check if first-time visitor on mount, listen for py_start_tour events, and check query params
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStartTourEvent = (e) => {
      startTour(e?.detail?.stepIndex ?? 0);
    };
    window.addEventListener("py_start_tour", handleStartTourEvent);

    // Support URL trigger e.g. /#/?tour=true or /#/home?tour=true
    if (
      window.location.search.includes("tour=true") ||
      window.location.hash.includes("tour=true")
    ) {
      const timer = setTimeout(() => {
        startTour(0);
      }, 350);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("py_start_tour", handleStartTourEvent);
      };
    }

    try {
      const seen = localStorage.getItem(GUIDE_STORAGE_KEY);
      if (!seen) {
        setHasSeenTour(false);
        // Delay slightly for smooth page render before offering welcome modal
        const timer = setTimeout(() => {
          setIsWelcomeOpen(true);
        }, 800);
        return () => {
          clearTimeout(timer);
          window.removeEventListener("py_start_tour", handleStartTourEvent);
        };
      } else {
        setHasSeenTour(true);
      }
    } catch {
      // Storage unavailable or disabled
    }

    return () => {
      window.removeEventListener("py_start_tour", handleStartTourEvent);
    };
  }, [startTour]);

  const closeTour = useCallback(() => {
    setIsTourActive(false);
  }, []);

  const skipTour = useCallback(() => {
    setIsTourActive(false);
    setIsWelcomeOpen(false);
    markTourCompleted();
  }, [markTourCompleted]);

  const finishTour = useCallback(() => {
    setIsTourActive(false);
    setIsWelcomeOpen(false);
    markTourCompleted();
    setIsCompletionOpen(true);
    if (soundEnabled) playCelebrationChime();
  }, [markTourCompleted, soundEnabled]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < GUIDE_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      syncRouteForStep(GUIDE_STEPS[nextIdx]);
      if (soundEnabled) playSuccessChime();
    } else {
      finishTour();
    }
  }, [currentStepIndex, syncRouteForStep, soundEnabled, finishTour]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      syncRouteForStep(GUIDE_STEPS[prevIdx]);
      if (soundEnabled) playSuccessChime();
    }
  }, [currentStepIndex, syncRouteForStep, soundEnabled]);

  const jumpToStep = useCallback(
    (index) => {
      if (index >= 0 && index < GUIDE_STEPS.length) {
        setCurrentStepIndex(index);
        syncRouteForStep(GUIDE_STEPS[index]);
        if (soundEnabled) playSuccessChime();
      }
    },
    [syncRouteForStep, soundEnabled]
  );

  const restartTour = useCallback(() => {
    setIsCompletionOpen(false);
    startTour(0);
  }, [startTour]);

  const resetTour = useCallback(() => {
    try {
      localStorage.removeItem(GUIDE_STORAGE_KEY);
    } catch {
      // ignore
    }
    setHasSeenTour(false);
    startTour(0);
  }, [startTour]);

  // Explorer modal controls
  const openExplorer = useCallback((initialCategory = "all") => {
    setIsWelcomeOpen(false);
    setIsTourActive(false);
    setIsCompletionOpen(false);
    setIsContextualHelpOpen(false);
    setExplorerCategory(initialCategory);
    setIsExplorerOpen(true);
  }, []);

  const closeExplorer = useCallback(() => {
    setIsExplorerOpen(false);
  }, []);

  // Contextual page guidance controls
  const openContextualHelp = useCallback((pageId = "home") => {
    setContextualHelpPage(pageId);
    setIsContextualHelpOpen(true);
  }, []);

  const closeContextualHelp = useCallback(() => {
    setIsContextualHelpOpen(false);
  }, []);

  // Completion modal controls
  const openCompletion = useCallback(() => {
    setIsCompletionOpen(true);
  }, []);

  const closeCompletion = useCallback(() => {
    setIsCompletionOpen(false);
  }, []);

  // Welcome modal controls
  const openWelcomeModal = useCallback(() => {
    setIsTourActive(false);
    setIsExplorerOpen(false);
    setIsCompletionOpen(false);
    setIsWelcomeOpen(true);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  // Navigate to any page from explorer or guidance
  const navigateToPage = useCallback(
    (pageKey, topicId) => {
      setIsExplorerOpen(false);
      setIsWelcomeOpen(false);
      setIsCompletionOpen(false);
      setIsContextualHelpOpen(false);

      if (pageKey === "lesson" && topicId && onSelectTopic) {
        onSelectTopic(topicId);
      } else if (onNavigate) {
        onNavigate(pageKey);
      } else if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("py_navigate", {
            detail: { page: pageKey, topicId }
          })
        );
      }
    },
    [onNavigate, onSelectTopic]
  );

  const currentStep = GUIDE_STEPS[currentStepIndex] || GUIDE_STEPS[0];

  const value = {
    // Tour state
    isTourActive,
    currentStepIndex,
    currentStep,
    totalSteps: GUIDE_STEPS.length,
    allSteps: GUIDE_STEPS,
    soundEnabled,
    toggleSound,
    startTour,
    closeTour,
    nextStep,
    prevStep,
    jumpToStep,
    skipTour,
    finishTour,
    restartTour,
    resetTour,

    // Welcome Modal
    isWelcomeOpen,
    setIsWelcomeOpen,
    openWelcomeModal,

    // Explore All Pages Modal
    isExplorerOpen,
    explorerCategory,
    setExplorerCategory,
    openExplorer,
    closeExplorer,

    // Contextual Guidance
    isContextualHelpOpen,
    contextualHelpPage,
    openContextualHelp,
    closeContextualHelp,

    // Tour Completion
    isCompletionOpen,
    openCompletion,
    closeCompletion,

    // Shared navigation & registry
    pagesRegistry: APP_PAGES_REGISTRY,
    navigateToPage,
    hasSeenTour,
    markTourCompleted
  };

  return (
    <GuideTutorialContext.Provider value={value}>
      {children}
    </GuideTutorialContext.Provider>
  );
}

const defaultGuideValue = {
  isTourActive: false,
  currentStepIndex: 0,
  currentStep: GUIDE_STEPS[0],
  totalSteps: GUIDE_STEPS.length,
  allSteps: GUIDE_STEPS,
  soundEnabled: true,
  toggleSound: () => {},
  startTour: () => {},
  closeTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  jumpToStep: () => {},
  skipTour: () => {},
  finishTour: () => {},
  restartTour: () => {},
  resetTour: () => {},
  isWelcomeOpen: false,
  setIsWelcomeOpen: () => {},
  openWelcomeModal: () => {},
  isExplorerOpen: false,
  explorerCategory: "all",
  setExplorerCategory: () => {},
  openExplorer: () => {},
  closeExplorer: () => {},
  isContextualHelpOpen: false,
  contextualHelpPage: "home",
  openContextualHelp: () => {},
  closeContextualHelp: () => {},
  isCompletionOpen: false,
  openCompletion: () => {},
  closeCompletion: () => {},
  pagesRegistry: APP_PAGES_REGISTRY,
  navigateToPage: (pageKey, topicId) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("py_navigate", { detail: { page: pageKey, topicId } })
      );
    }
  },
  hasSeenTour: true,
  markTourCompleted: () => {}
};

export function useGuideTutorial() {
  const context = useContext(GuideTutorialContext);
  return context || defaultGuideValue;
}
