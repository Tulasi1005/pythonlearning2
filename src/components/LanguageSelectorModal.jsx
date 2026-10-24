import React, { useEffect } from "react";
import { X, Globe } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { useBodyScrollLock } from "../utils/scrollLock";

export default function LanguageSelectorModal({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage
}) {
  // Lock background page scroll while Language modal is open
  useBodyScrollLock(isOpen);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-[#050B14]/85 backdrop-blur-sm animate-in"
      onClick={onClose}
      onWheel={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
    >
      <div
        className="bg-white dark:bg-[#0C1B30] rounded-3xl border border-slate-200 dark:border-[#183657] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-8 relative scrollbar-thin overscroll-contain"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-[#102541] hover:bg-slate-200 dark:hover:bg-[#102B4A] text-slate-700 dark:text-[#FFFFFF] flex items-center justify-center transition cursor-pointer border border-slate-200 dark:border-[#183657] shadow-2xs z-10"
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Content */}
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onSelectLanguage={(langId) => {
            onSelectLanguage(langId);
            onClose();
          }}
          showTitle={true}
        />
      </div>
    </div>
  );
}
