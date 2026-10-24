import React from "react";
import { ArrowLeft } from "lucide-react";

export default function PageBackButton({
  onBack,
  label = "Back",
  fallbackDestination = "",
  className = ""
}) {
  if (!onBack) return null;

  return (
    <button
      onClick={onBack}
      className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-[#FFFFFF] bg-white dark:bg-[#0C1B30] hover:bg-slate-100 dark:hover:bg-[#102541] border border-slate-200 dark:border-[#183657] hover:border-[#168BFF] dark:hover:border-[#168BFF] transition-all cursor-pointer shadow-xs hover:shadow-sm active:scale-95 group shrink-0 ${className}`}
      title={fallbackDestination ? `Back to ${fallbackDestination}` : "Go back to previous page"}
      aria-label="Go back"
    >
      <ArrowLeft
        size={15}
        className="text-[#168BFF] dark:text-[#60B7FF] group-hover:-translate-x-0.5 transition-transform shrink-0"
      />
      <span>{label}</span>
      {fallbackDestination && (
        <span className="text-[11px] font-medium text-slate-400 dark:text-[#91A6BF] hidden sm:inline">
          ({fallbackDestination})
        </span>
      )}
    </button>
  );
}
