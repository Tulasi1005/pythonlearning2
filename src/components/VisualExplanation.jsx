import React from "react";
import {
  Sparkles,
  Bot,
  Monitor,
  Gamepad2,
  Cpu,
  Zap,
  Tag,
  Box,
  User,
  Heart,
  Coins,
  FileCode,
  Workflow,
  Globe,
  Server,
  Database,
  ShieldCheck,
  Layers,
  ArrowRight,
  CheckCircle,
  Play,
  Activity,
  ShoppingBag,
  Clock,
  Sun,
  Truck,
  Trophy,
  Shield,
  GitFork,
  AlertCircle
} from "lucide-react";

// Icon mapping dictionary
const ICON_MAP = {
  Sparkles,
  Bot,
  Monitor,
  Gamepad2,
  Cpu,
  Zap,
  Tag,
  Box,
  User,
  Heart,
  Coins,
  FileCode,
  Workflow,
  Globe,
  Server,
  Database,
  ShieldCheck,
  Layers,
  ArrowRight,
  CheckCircle,
  Play,
  Activity,
  ShoppingBag,
  Clock,
  Sun,
  Truck,
  Trophy,
  Shield,
  GitFork,
  AlertCircle
};

export default function VisualExplanation({ visual, stageId = "young", topicTitle }) {
  if (!visual) return null;

  // Stage thematic borders and header colors
  const stageThemes = {
    kid: {
      cardBg: "bg-blue-50/50 dark:bg-[#101b2d]",
      border: "border-blue-200 dark:border-[#23344d]",
      badgeColor: "bg-blue-100 dark:bg-[#14233a] text-blue-800 dark:text-[#93c5fd] border-blue-200 dark:border-[#23344d]",
      iconColor: "text-[#3b82f6] dark:text-[#60a5fa]",
      nodeBg: "bg-white dark:bg-[#14233a] border-blue-200 dark:border-[#23344d] shadow-xs"
    },
    young: {
      cardBg: "bg-blue-50/50 dark:bg-[#101b2d]",
      border: "border-blue-200 dark:border-[#23344d]",
      badgeColor: "bg-blue-100 dark:bg-[#14233a] text-blue-800 dark:text-[#93c5fd] border-blue-200 dark:border-[#23344d]",
      iconColor: "text-[#3b82f6] dark:text-[#60a5fa]",
      nodeBg: "bg-white dark:bg-[#14233a] border-blue-200 dark:border-[#23344d] shadow-xs"
    },
    college: {
      cardBg: "bg-blue-50/50 dark:bg-[#101b2d]",
      border: "border-blue-200 dark:border-[#23344d]",
      badgeColor: "bg-blue-100 dark:bg-[#14233a] text-blue-800 dark:text-[#93c5fd] border-blue-200 dark:border-[#23344d]",
      iconColor: "text-[#3b82f6] dark:text-[#60a5fa]",
      nodeBg: "bg-white dark:bg-[#14233a] border-blue-200 dark:border-[#23344d] shadow-xs"
    },
    graduate: {
      cardBg: "bg-blue-50/50 dark:bg-[#101b2d]",
      border: "border-blue-200 dark:border-[#23344d]",
      badgeColor: "bg-blue-100 dark:bg-[#14233a] text-blue-800 dark:text-[#60a5fa] border-blue-200 dark:border-[#23344d]",
      iconColor: "text-[#3b82f6] dark:text-[#38bdf8]",
      nodeBg: "bg-white dark:bg-[#14233a] border-blue-200 dark:border-[#23344d] shadow-xs"
    },
    professional: {
      cardBg: "bg-blue-50/50 dark:bg-[#101b2d]",
      border: "border-blue-200 dark:border-[#23344d]",
      badgeColor: "bg-blue-100 dark:bg-[#14233a] text-blue-800 dark:text-[#38bdf8] border-blue-200 dark:border-[#23344d]",
      iconColor: "text-[#3b82f6] dark:text-[#38bdf8]",
      nodeBg: "bg-white dark:bg-[#14233a] border-blue-200 dark:border-[#23344d] shadow-xs"
    }
  };

  const currentTheme = stageThemes[stageId] || stageThemes.young;

  return (
    <section className={`visual-explanation-card p-5 sm:p-7 rounded-2xl border ${currentTheme.border} ${currentTheme.cardBg} my-4 shadow-sm backdrop-blur-md`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl select-none">🖼️</span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Visual Explanation: {visual.metaphor || topicTitle}
          </h3>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${currentTheme.badgeColor} shadow-2xs`}>
          {visual.badge || "Visual Diagram"}
        </span>
      </div>

      {/* Description */}
      {visual.description && (
        <p className="body-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          {visual.description}
        </p>
      )}

      {/* Diagram / Visual Blocks Grid */}
      {visual.elements && visual.elements.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-2">
          {visual.elements.map((elem, idx) => {
            const IconComponent = ICON_MAP[elem.icon] || Sparkles;

            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between ${currentTheme.nodeBg} transition hover:shadow-md hover:-translate-y-0.5`}
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {elem.label}
                  </span>
                  <div className={`p-2 rounded-xl bg-slate-100 dark:bg-[#0c1422] ${currentTheme.iconColor}`}>
                    <IconComponent size={18} />
                  </div>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono break-words">
                  {elem.value}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
