import React from "react";
import LearningStageSelector from "../components/LearningStageSelector";
import LanguageSelector from "../components/LanguageSelector";
import PageBackButton from "../components/PageBackButton";
import { PageHelpButton } from "../components/GuideTutorial/ContextualPageGuidance";
import { getStageById } from "../data/learningStages";
import { getLanguageById } from "../data/learningLanguages";
import { useDictionary } from "../context/DictionaryContext";
import { isFreeTopic } from "../data/allTopics";
import { useAuth } from "../context/AuthContext";
import {
  Code2,
  Terminal,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Layers,
  Cpu,
  Globe,
  Bot,
  Compass,
  Repeat,
  Boxes,
  RotateCw,
  Search,
  BookMarked,
  Flame,
  ShieldCheck,
  Lock
} from "lucide-react";

export default function Home({
  onNavigate,
  onSelectTopic,
  selectedStage,
  onSelectStage,
  selectedLanguage,
  onSelectLanguage,
  onOpenStageModal,
  onOpenLanguageModal,
  onBack,
  canGoBack
}) {
  const { openDictionary } = useDictionary();
  const { isAuthenticated } = useAuth();
  const currentStageMeta = getStageById(selectedStage);
  const currentLangMeta = getLanguageById(selectedLanguage);

  const featuredTopics = [
    {
      id: "what-is-python",
      title: "What is Python?",
      section: "Python Basics",
      icon: Code2,
      color: "from-[#2563eb] to-[#3b82f6]",
      desc: "Get started with Python syntax, design philosophy, and beginner fundamentals."
    },
    {
      id: "why-learn-python",
      title: "Why Learn Python?",
      section: "Python Basics",
      icon: Zap,
      color: "from-[#2563eb] to-[#38bdf8]",
      desc: "Discover real-world applications in web development, AI, automation, and data."
    },
    {
      id: "variables",
      title: "Variables & Memory Binding",
      section: "Python Basics",
      icon: Boxes,
      color: "from-[#2563eb] to-[#3b82f6]",
      desc: "How Python names, binds, and stores information in memory."
    },
    {
      id: "for-loop",
      title: "Loops & Iterations",
      section: "Control Flow",
      icon: Repeat,
      color: "from-[#2563eb] to-[#38bdf8]",
      desc: "Repeat actions automatically and traverse sequence collections."
    },
    {
      id: "what-is-a-function",
      title: "Functions & Parameters",
      section: "Modular Logic",
      icon: Terminal,
      color: "from-[#2563eb] to-[#3b82f6]",
      desc: "Build reusable blocks of code and encapsulate logic cleanly."
    },
    {
      id: "what-is-ai",
      title: "AI & Large Language Models",
      section: "Modern AI & LLMs",
      icon: Bot,
      color: "from-[#2563eb] to-[#38bdf8]",
      desc: "Explore generative AI, prompt engineering, and embeddings."
    }
  ];

  const corePillars = [
    {
      icon: "🎯",
      title: "Adaptive Age Stages",
      desc: "From 5-year-old toy box stories to professional enterprise software architectures across 5 distinct age levels."
    },
    {
      icon: "🗣️",
      title: "4 Explanation Languages",
      desc: "Choose between Professional English, Friend-style English+Telugu mix, Pure Telugu, or Simple Hindi."
    },
    {
      icon: "🔄",
      title: "Another Explanation Modes",
      desc: "Switch instantly to Story, Real-life, Friend, Visual Diagram, Step-by-Step, or Analogy formats with one click!"
    }
  ];

  return (
    <div className="home-page-container max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 md:py-10 pb-16 sm:pb-20 md:pb-24 w-full min-w-0 animate-in">
      {/* Back Navigation Button if navigated from elsewhere */}
      {canGoBack && onBack && (
        <div className="mb-3 sm:mb-4 flex items-center justify-start">
          <PageBackButton onBack={onBack} label="Back to Previous Page" />
        </div>
      )}

      {/* 1. HERO SECTION */}
      <div className="mb-12 pb-10 border-b border-slate-200 dark:border-[#183657]">
        <div id="tour-home-hero" className="rounded-2xl p-2 -m-2">
          {/* Top Tag & Contextual Page Guide Button */}
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-[#8CC8FF] text-xs sm:text-sm font-bold shadow-2xs">
              <Sparkles size={16} className="text-[#168BFF] dark:text-[#38bdf8]" />
              <span>Interactive Adaptive Python Platform</span>
            </div>
            <PageHelpButton pageId="home" />
          </div>

          <h1 className="heading-hero mb-4 text-slate-900 dark:text-white">
            Learn Python with <br className="hidden sm:inline" />
            <span className="gradient-text-primary">
              Adaptive Explanations
            </span>
          </h1>

          <p className="body-large text-slate-600 dark:text-[#D2DEEC] max-w-2xl leading-relaxed mb-6">
            A step-by-step programming curriculum designed for complete beginners to experts, adapted to your age stage and native language preferences.
          </p>
        </div>

        {/* Selected Config Cards */}
        <div id="tour-home-config" className="bg-white dark:bg-[#0C1B30] backdrop-blur-md border border-slate-200 dark:border-[#183657] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 max-w-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-[#183657]">
            <span className="text-slate-700 dark:text-[#D2DEEC] text-sm sm:text-base font-semibold flex items-center gap-2">
              <span className="text-lg">🎯</span> Current Learning Stage:
            </span>
            <button
              id="tour-home-stage-btn"
              onClick={onOpenStageModal}
              className="inline-flex items-center justify-between sm:justify-start gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#102541] border border-slate-200 dark:border-[#183657] text-[#168BFF] dark:text-[#8CC8FF] text-xs sm:text-sm font-bold cursor-pointer hover:border-[#168BFF] transition shadow-2xs"
            >
              <span>{currentStageMeta.icon} {currentStageMeta.label} ({currentStageMeta.ageRange})</span>
              <span className="text-xs text-[#168BFF] dark:text-[#60B7FF] font-extrabold underline ml-1">Change</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-[#183657]">
            <span className="text-slate-700 dark:text-[#D2DEEC] text-sm sm:text-base font-semibold flex items-center gap-2">
              <span className="text-lg">🗣️</span> Explanation Language:
            </span>
            <button
              id="tour-home-lang-btn"
              onClick={onOpenLanguageModal}
              className="inline-flex items-center justify-between sm:justify-start gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#102541] border border-slate-200 dark:border-[#183657] text-[#168BFF] dark:text-[#8CC8FF] text-xs sm:text-sm font-bold cursor-pointer hover:border-[#168BFF] transition shadow-2xs"
            >
              <span>{currentLangMeta.icon} {currentLangMeta.label}</span>
              <span className="text-xs text-[#168BFF] dark:text-[#60B7FF] font-extrabold underline ml-1">Change</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 text-xs sm:text-sm text-slate-500 dark:text-[#91A6BF] font-medium">
            <span className="flex items-center gap-2">
              <span>📚</span> Full Curriculum:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">18 Sections • 120 Interactive Topics</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 mt-8">
          <button
            onClick={() => onSelectTopic("what-is-python")}
            className="btn-vibrant-primary"
          >
            <Sparkles size={18} />
            <span>Start Free Lesson 1</span>
          </button>

          <button
            onClick={() => onNavigate("learn")}
            className="btn-vibrant-secondary"
          >
            <BookOpen size={18} className="text-[#168BFF] dark:text-[#38bdf8]" />
            <span>Explore Curriculum</span>
          </button>

          <button
            onClick={() => onNavigate("practice")}
            className="btn-vibrant-secondary"
          >
            <Compass size={18} className="text-[#168BFF] dark:text-[#38bdf8]" />
            <span>Interactive Practice</span>
          </button>

          <button
            onClick={() => openDictionary()}
            className="btn-vibrant-secondary"
          >
            <Search size={18} className="text-[#168BFF] dark:text-[#60a5fa]" />
            <span>Word Meaning Lookup</span>
          </button>
        </div>
      </div>

      {/* 2. CORE PILLARS */}
      <div className="mb-14">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#168BFF] mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-[#168BFF]" />
          <span>How This Adaptive Guide Works</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {corePillars.map((p, idx) => (
            <div key={idx} className="modern-card p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <span className="text-3xl block mb-3">{p.icon}</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 dark:text-[#D2DEEC] leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. STAGE SELECTOR BLOCK */}
      <div id="tour-home-stage" className="mb-14 pb-10 border-b border-slate-200 dark:border-[#183657]">
        <LearningStageSelector
          selectedStage={selectedStage}
          onSelectStage={onSelectStage}
          showTitle={true}
        />
      </div>

      {/* 4. LANGUAGE SELECTOR BLOCK */}
      <div id="tour-home-lang" className="mb-14 pb-10 border-b border-slate-200 dark:border-[#183657]">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onSelectLanguage={onSelectLanguage}
          showTitle={true}
        />
      </div>

      {/* 5. FEATURED TOPICS */}
      <div id="tour-home-highlights" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="heading-section text-slate-900 dark:text-white">
              Curriculum Highlights
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#D2DEEC] mt-1">
              Customized for <strong>{currentStageMeta.label} ({currentStageMeta.ageRange})</strong> in <strong>{currentLangMeta.label}</strong>.
            </p>
          </div>

          <button
            onClick={() => onNavigate("learn")}
            className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#168BFF] hover:text-[#0876E8] dark:hover:text-[#60B7FF] hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            <span>View All 18 Sections</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTopics.map((item, idx) => {
            const Icon = item.icon;
            const isFree = isFreeTopic(item.id);
            const isLocked = !isAuthenticated && !isFree;

            return (
              <div
                key={idx}
                onClick={() => onSelectTopic(item.id)}
                className="modern-card p-5 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="notion-tag text-xs font-bold text-blue-600 dark:text-[#8CC8FF]">
                        {item.section}
                      </span>
                      {isFree && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
                          <Sparkles size={11} className="text-emerald-500" />
                          <span>Free Preview</span>
                        </span>
                      )}
                      {isLocked && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-full">
                          <Lock size={11} className="text-amber-500" />
                          <span>Account Required</span>
                        </span>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#168BFF] to-[#0876E8] text-white flex items-center justify-center shadow-xs">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#168BFF] dark:group-hover:text-[#60B7FF] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-[#D2DEEC] leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-[#183657] flex items-center justify-between text-xs sm:text-sm font-bold text-[#168BFF]">
                  <span className={isLocked ? "text-amber-600 dark:text-amber-400 font-semibold" : ""}>
                    {isLocked ? "Sign In to Read" : "Read Lesson"}
                  </span>
                  {isLocked ? (
                    <Lock size={14} className="text-amber-500 shrink-0" />
                  ) : (
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
