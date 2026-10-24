import React, { useState } from "react";
import CodeBlock from "./CodeBlock";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, HelpCircle, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function QuestionCard({ item, index }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [selectedOption, setSelectedOption] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const isCorrect = selectedOption && selectedOption === item.correctAnswer;

  const handleOptionClick = (opt) => {
    if (!isAuthenticated) {
      openAuthModal("login", "Sign in required to answer practice questions and check answers!");
      return;
    }
    setSelectedOption(opt);
  };

  const handleRevealClick = () => {
    if (!isAuthenticated) {
      openAuthModal("login", "Sign in required to view question explanations!");
      return;
    }
    setRevealed(!revealed);
  };

  return (
    <div className="modern-card p-5 sm:p-7 transition-colors">
      {/* Question Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-r from-[#168BFF] to-[#0876E8] text-white flex items-center justify-center text-xs font-bold font-mono shadow-xs">
            {index + 1}
          </span>
          <span className="notion-tag text-xs uppercase font-bold text-[#8CC8FF] bg-[#102541] border border-[#183657]">
            {item.type}
          </span>
        </div>
        <span className="notion-tag text-xs capitalize text-[#D2DEEC] font-bold">
          {item.category}
        </span>
      </div>

      {/* Question Statement */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-4">
        {item.question}
      </h3>

      {/* Code Snippet if applicable */}
      {item.code && (
        <div className="mb-4">
          <CodeBlock code={item.code} language="python" title="Code Snippet" />
        </div>
      )}

      {/* Options List */}
      {item.options && (
        <div className="space-y-2.5 mb-4">
          {item.options.map((opt, optIdx) => {
            const isSelected = selectedOption === opt;
            const isActualAnswer = opt === item.correctAnswer;

            let optionClass = "border-slate-200 dark:border-[#183657] bg-slate-50 dark:bg-[#0C1B30] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-[#102541]";
            if (revealed) {
              if (isActualAnswer) {
                optionClass = "border-[#168BFF] bg-blue-50 dark:bg-[#102B4A] text-blue-900 dark:text-white font-bold shadow-xs ring-2 ring-[#168BFF]/40";
              } else if (isSelected && !isActualAnswer) {
                optionClass = "border-slate-200 dark:border-[#183657] bg-slate-100 dark:bg-[#081426] text-slate-400 dark:text-[#91A6BF] font-medium opacity-80";
              }
            } else if (isSelected) {
              optionClass = "border-[#168BFF] bg-blue-50 dark:bg-[#102B4A] text-blue-900 dark:text-white font-bold shadow-xs ring-2 ring-[#168BFF]/40";
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleOptionClick(opt)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm sm:text-base font-semibold transition flex items-center justify-between cursor-pointer ${optionClass}`}
              >
                <span>{opt}</span>
                {revealed && isActualAnswer && (
                  <CheckCircle2 size={18} className="text-[#168BFF] flex-shrink-0 ml-2" />
                )}
                {revealed && isSelected && !isActualAnswer && (
                  <XCircle size={18} className="text-slate-400 dark:text-[#91A6BF] flex-shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-200 dark:border-[#183657]">
        <button
          onClick={handleRevealClick}
          className="btn-vibrant-primary w-full sm:w-auto"
        >
          {!isAuthenticated && <Lock size={15} className="text-white/80" />}
          {revealed ? (
            <>
              <ChevronUp size={16} /> <span>Hide Explanation</span>
            </>
          ) : (
            <>
              <ChevronDown size={16} /> <span>Show Explanation</span>
            </>
          )}
        </button>

        {selectedOption && !revealed && (
          <span className="text-xs sm:text-sm text-[#168BFF] font-bold">
            Option selected • Check answer!
          </span>
        )}
      </div>

      {/* Answer & Explanation Box */}
      {revealed && (
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#081426] border border-slate-200 dark:border-[#183657] animate-in">
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">
            <span className="text-[#168BFF]">Correct Answer:</span>
            <span>{item.correctAnswer}</span>
          </div>
          <p className="body-base text-slate-700 dark:text-[#D2DEEC] leading-relaxed pt-2 border-t border-slate-200 dark:border-[#183657] m-0">
            <strong className="text-slate-900 dark:text-white block mb-1">Explanation:</strong>
            {item.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
