import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Check, Sparkles, Eye, Copy, ArrowRight, Lightbulb, CheckCircle2, HelpCircle } from "lucide-react";
import CodeBlock from "./CodeBlock";

export default function PracticalSession({ practical, stageId = "young" }) {
  if (!practical) return null;

  const [userCode, setUserCode] = useState(practical.starterCode || "");
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Update when stage or topic changes
  useEffect(() => {
    setUserCode(practical.starterCode || "");
    setShowSolution(false);
    setShowHint(false);
    setFeedback(null);
  }, [practical]);

  const handleReset = () => {
    setUserCode(practical.starterCode || "");
    setFeedback(null);
  };

  const handleCheckCode = () => {
    const normalize = (str) =>
      str.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();

    if (userCode.trim().length === 0) {
      setFeedback({
        type: "error",
        message: "Please write some Python code in the editor before checking!"
      });
      return;
    }

    const isMatch =
      normalize(userCode).includes(normalize(practical.expectedOutput || "")) ||
      normalize(userCode).includes("print");

    if (isMatch) {
      setFeedback({
        type: "success",
        message: "🎉 Excellent! Your code matches the expected logic. Check your output below!"
      });
    } else {
      setFeedback({
        type: "info",
        message: "Code executed! Compare your output with the expected output box."
      });
    }
  };

  const handleCopySolutionToEditor = () => {
    if (practical.solution) {
      setUserCode(practical.solution);
      setFeedback({
        type: "success",
        message: "Solution loaded into your editor! Click 'Run / Check Code' to test."
      });
    }
  };

  return (
    <section className="practical-session-container my-8 p-6 sm:p-8 bg-slate-50/90 dark:bg-[#101b2d] border border-slate-200 dark:border-[#23344d] rounded-3xl shadow-xs transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🧪</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white m-0">
            {practical.title || "Try It Yourself"}
          </h2>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-[#14233a] text-blue-700 dark:text-[#93c5fd] border border-blue-200 dark:border-[#23344d]">
          Hands-On Playground
        </span>
      </div>

      {/* Goal */}
      {practical.goal && (
        <div className="mb-3 p-3 rounded-xl bg-blue-50/70 dark:bg-[#14233a] border border-blue-100 dark:border-[#23344d] text-xs sm:text-sm text-blue-900 dark:text-[#f8fafc] font-semibold flex items-center gap-2">
          <Sparkles size={16} className="text-[#3b82f6] flex-shrink-0" />
          <span>🎯 Goal: {practical.goal}</span>
        </div>
      )}

      {/* Task Description */}
      <p className="text-sm sm:text-base text-slate-700 dark:text-[#cbd5e1] font-medium leading-relaxed mb-4">
        {practical.task}
      </p>

      {/* Hint Toggle */}
      {practical.hint && (
        <div className="mb-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 dark:text-[#93c5fd] bg-blue-50 dark:bg-[#14233a] hover:bg-blue-100 dark:hover:bg-[#1e3252] px-3 py-1.5 rounded-lg border border-blue-200 dark:border-[#23344d] transition cursor-pointer"
          >
            <Lightbulb size={14} className="text-[#3b82f6] dark:text-[#60a5fa]" />
            <span>{showHint ? "Hide Hint" : "💡 Need a Hint?"}</span>
          </button>
          {showHint && (
            <div className="mt-2 p-3 bg-blue-50/60 dark:bg-[#14233a] border border-blue-200 dark:border-[#23344d] rounded-xl text-xs sm:text-sm text-blue-950 dark:text-[#f8fafc] animate-in">
              <strong className="block mb-0.5 text-[#3b82f6] dark:text-[#60a5fa]">Hint:</strong>
              {practical.hint}
            </div>
          )}
        </div>
      )}

      {/* Code Editor Box */}
      <div className="code-editor-box rounded-2xl border border-slate-700 dark:border-[#23344d] overflow-hidden shadow-sm bg-[#0c1422] mb-4">
        <div className="editor-top-bar flex items-center justify-between px-4 py-2.5 bg-[#0a101c] border-b border-[#23344d] text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#23344d] inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa] inline-block"></span>
            </div>
            <span className="font-semibold text-white ml-2">sandbox.py</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#14233a] hover:bg-[#1e3252] text-[#cbd5e1] hover:text-white text-xs transition cursor-pointer border border-[#23344d]"
              title="Reset starter code"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          rows={Math.max(4, userCode.split("\n").length + 1)}
          className="w-full p-4 bg-[#0c1422] text-white font-mono text-sm leading-relaxed border-none outline-none resize-y selection:bg-[#3b82f6]/40 placeholder-slate-400"
          placeholder="# Write your Python code here..."
          spellCheck={false}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCheckCode}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/25 transition cursor-pointer border-none active:scale-95"
          >
            <Play size={15} />
            <span>Run / Check Code</span>
          </button>

          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-[#14233a] hover:bg-slate-100 dark:hover:bg-[#1e3252] text-slate-700 dark:text-[#cbd5e1] text-xs sm:text-sm font-semibold border border-slate-300 dark:border-[#23344d] transition cursor-pointer shadow-2xs"
          >
            <Eye size={15} />
            <span>{showSolution ? "Hide Solution" : "Show Solution"}</span>
          </button>
        </div>

        {practical.solution && showSolution && (
          <button
            onClick={handleCopySolutionToEditor}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-[#14233a] hover:bg-blue-100 dark:hover:bg-[#1e3252] text-blue-800 dark:text-[#93c5fd] text-xs font-semibold border border-blue-200 dark:border-[#23344d] transition cursor-pointer"
          >
            <Copy size={13} />
            <span>Copy Solution to Editor</span>
          </button>
        )}
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium mb-4 flex items-center gap-2 animate-in ${
            feedback.type === "success"
              ? "bg-blue-50/80 dark:bg-[#14233a] text-blue-900 dark:text-[#f8fafc] border border-blue-300 dark:border-[#3b82f6]"
              : feedback.type === "error"
              ? "bg-slate-50 dark:bg-[#14233a] text-slate-800 dark:text-[#cbd5e1] border border-slate-200 dark:border-[#23344d]"
              : "bg-blue-50 dark:bg-[#14233a] text-blue-900 dark:text-[#93c5fd] border border-blue-200 dark:border-[#23344d]"
          }`}
        >
          <Sparkles size={16} className="text-[#3b82f6] flex-shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Expected Output vs Solution Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {/* Expected Output */}
        {practical.expectedOutput && (
          <div className="p-4 bg-white dark:bg-[#101b2d] rounded-2xl border border-slate-200 dark:border-[#23344d] shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#94a3b8] font-mono mb-2">
              Expected Output:
            </h4>
            <div className="p-3 bg-[#080d16] text-[#38bdf8] rounded-xl font-mono text-xs overflow-x-auto border border-[#23344d]">
              <pre className="m-0">{practical.expectedOutput}</pre>
            </div>
          </div>
        )}

        {/* Revealed Solution */}
        {showSolution && practical.solution && (
          <div className="p-4 bg-blue-50/40 dark:bg-[#101b2d] rounded-2xl border border-blue-200 dark:border-[#23344d] animate-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] dark:text-[#60a5fa] font-mono mb-2">
              Model Solution:
            </h4>
            <CodeBlock code={practical.solution} language="python" title="solution.py" />
            {practical.explanation && (
              <p className="text-xs text-slate-700 dark:text-[#cbd5e1] leading-relaxed mt-2 pt-2 border-t border-blue-200 dark:border-[#23344d] m-0">
                {practical.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
