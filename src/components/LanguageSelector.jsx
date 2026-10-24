import React from "react";
import { LEARNING_LANGUAGES } from "../data/learningLanguages";
import { Check, ArrowRight } from "lucide-react";

export default function LanguageSelector({
  selectedLanguage,
  onSelectLanguage,
  showTitle = true,
  layout = "grid" // "grid" | "compact" | "list"
}) {
  return (
    <div className="language-selector w-full">
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="heading-section text-slate-900 dark:text-white mb-2">
            How do you want to learn?
          </h2>
          <p className="body-base text-slate-600 dark:text-[#D2DEEC] max-w-xl mx-auto">
            Choose your preferred language style. You can switch your language anytime during any lesson!
          </p>
        </div>
      )}

      <div
        className={`grid gap-4 ${
          layout === "compact"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : layout === "list"
            ? "grid-cols-1"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {LEARNING_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.id;

          const borderStyle = isSelected
            ? "border-2 border-[#168BFF] ring-4 ring-[#168BFF]/20 shadow-lg bg-blue-50/50 dark:bg-[#102B4A] scale-[1.02]"
            : "border border-slate-200 dark:border-[#183657] bg-white dark:bg-[#0C1B30] hover:border-[#168BFF] hover:shadow-md";

          return (
            <div
              key={lang.id}
              onClick={() => onSelectLanguage(lang.id)}
              className={`lang-card p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between relative group ${borderStyle}`}
            >
              {isSelected && (
                <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-[#168BFF] text-white flex items-center justify-center text-xs shadow-sm">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}

              <div>
                {/* Flag Icon & Short Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform select-none">
                    {lang.icon}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${lang.badgeBg}`}
                  >
                    {lang.shortLabel}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <span>{lang.label}</span>
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-[#D2DEEC] leading-relaxed mb-3">
                  {lang.description}
                </p>

                {/* Tagline / Vibe */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#081426] border border-slate-200 dark:border-[#183657] text-xs sm:text-sm text-slate-600 dark:text-[#D2DEEC] mb-4 italic">
                  "{lang.tagline}"
                </div>
              </div>

              {/* Select Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLanguage(lang.id);
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? "bg-gradient-to-r from-[#168BFF] to-[#0876E8] text-white shadow-sm shadow-[#168BFF]/25 border-transparent"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-[#102541] dark:hover:bg-[#102B4A] text-slate-800 dark:text-[#D2DEEC] hover:text-[#168BFF] dark:hover:text-white border-slate-200 dark:border-[#183657]"
                }`}
              >
                {isSelected ? (
                  <>
                    <Check size={16} />
                    <span>Selected</span>
                  </>
                ) : (
                  <>
                    <span>Choose Language</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
