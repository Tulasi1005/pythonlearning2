/**
 * ContextualPageGuidance.jsx
 * Contextual help slide-over modal / drawer providing instant guidance
 * tailored to whatever page the user is currently browsing.
 * Reuses appPagesRegistry for 100% data consistency.
 */

import React, { useEffect, useRef } from "react";
import { useGuideTutorial } from "../../context/GuideTutorialContext";
import { getPageById } from "../../data/appPagesRegistry";
import { useBodyScrollLock } from "../../utils/scrollLock";
import {
  HelpCircle,
  X,
  Compass,
  LayoutGrid,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Navigation
} from "lucide-react";

export function PageHelpButton({ pageId, className = "" }) {
  const { openContextualHelp } = useGuideTutorial();

  return (
    <button
      onClick={() => openContextualHelp(pageId)}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-[#102541] hover:bg-blue-100 dark:hover:bg-[#183657] text-[#168BFF] dark:text-[#60B7FF] border border-blue-200/80 dark:border-[#1e3a63] transition shadow-2xs cursor-pointer group shrink-0 ${className}`}
      title="How to use this page & features guide"
      aria-label="Page Guide & Tips"
    >
      <HelpCircle size={14} className="group-hover:rotate-12 transition-transform shrink-0" />
      <span className="hidden sm:inline">Page Guide</span>
      <span className="sm:hidden">Help</span>
    </button>
  );
}

export default function ContextualPageGuidance() {
  const {
    isContextualHelpOpen,
    contextualHelpPage,
    closeContextualHelp,
    startTour,
    openExplorer
  } = useGuideTutorial();

  // Lock background scroll whenever drawer is open
  useBodyScrollLock(isContextualHelpOpen);

  const sheetRef = useRef(null);
  const pageData = getPageById(contextualHelpPage) || getPageById("home");
  const guidance = pageData?.contextualGuidance || {};

  // Escape key closes sheet
  useEffect(() => {
    if (!isContextualHelpOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeContextualHelp();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isContextualHelpOpen, closeContextualHelp]);

  if (!isContextualHelpOpen || !pageData) return null;

  return (
    <div
      className="contextual-guidance-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contextual-help-title"
    >
      {/* Background dismissal click */}
      <div
        className="contextual-guidance-backdrop"
        onClick={closeContextualHelp}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
        aria-hidden="true"
      />

      {/* Slide-over Content Drawer */}
      <div
        ref={sheetRef}
        className="contextual-guidance-drawer"
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="contextual-guidance-header">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 rounded-xl bg-blue-500/10 text-[#168BFF] dark:text-[#60B7FF] shrink-0">
              <HelpCircle size={18} />
            </span>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block leading-tight">
                Contextual Page Guide
              </span>
              <h2
                id="contextual-help-title"
                className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate m-0"
              >
                {pageData.title}
              </h2>
            </div>
          </div>

          <button
            onClick={closeContextualHelp}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer border-none bg-transparent shrink-0"
            title="Close Guide (Esc)"
            aria-label="Close Guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="contextual-guidance-body">
          {/* 1. What this page is for */}
          <div className="contextual-guidance-card">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              <Compass size={14} className="text-[#168BFF]" />
              <span>What this page is for</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#D2DEEC] leading-relaxed m-0">
              {guidance.purpose || pageData.description}
            </p>
          </div>

          {/* 2. Main actions you can take */}
          {guidance.mainActions && (
            <div className="contextual-guidance-card">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Main actions you can take</span>
              </div>
              <ul className="space-y-1.5 pl-0 m-0 list-none text-xs text-slate-600 dark:text-[#D2DEEC]">
                {guidance.mainActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#168BFF] mt-1.5 shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. How to get started */}
          {guidance.howToStart && (
            <div className="contextual-guidance-card bg-blue-50/60 dark:bg-[#102541]/90 border-blue-200/60 dark:border-[#183657]">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-[#8CC8FF] mb-1.5">
                <Lightbulb size={14} className="text-amber-500" />
                <span>How to get started</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-[#D2DEEC] leading-relaxed m-0">
                {guidance.howToStart}
              </p>
            </div>
          )}

          {/* 4. Where to go next */}
          {guidance.nextSteps && (
            <div className="contextual-guidance-card">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                <Navigation size={14} className="text-purple-500" />
                <span>Where to go next</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#D2DEEC] leading-relaxed m-0">
                {guidance.nextSteps}
              </p>
            </div>
          )}

          {/* Navigation Path */}
          <div className="text-[11px] text-slate-500 dark:text-[#91A6BF] px-1 break-words min-w-0">
            <span className="font-bold text-slate-700 dark:text-slate-300">Navigation:</span>{" "}
            {pageData.navLocation}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="contextual-guidance-footer">
          <button
            onClick={() => {
              closeContextualHelp();
              startTour(0);
            }}
            className="btn-vibrant-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles size={14} />
            <span>Start Step-by-Step Tour</span>
          </button>

          <button
            onClick={() => {
              closeContextualHelp();
              openExplorer("all");
            }}
            className="btn-vibrant-secondary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-[#183657]"
          >
            <LayoutGrid size={14} className="text-[#168BFF]" />
            <span>Explore App Directory</span>
          </button>
        </div>
      </div>
    </div>
  );
}
