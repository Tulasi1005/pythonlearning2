import React, { useState, useEffect, useRef } from "react";
import CodeBlock from "./CodeBlock";
import VisualExplanation from "./VisualExplanation";
import LivePythonRunner from "./LivePythonRunner";
import ProgressRing from "./ProgressRing";
import ConfettiCelebration from "./ConfettiCelebration";
import TopicNotes from "./TopicNotes";
import { PageHelpButton } from "./GuideTutorial/ContextualPageGuidance";
import { playCelebrationChime, playSuccessChime } from "../utils/audioCelebration";
import { LEARNING_STAGES, getStageById } from "../data/learningStages";
import { LEARNING_LANGUAGES, getLanguageById } from "../data/learningLanguages";
import { EXPLANATION_FORMATS, getFormatById } from "../data/explanationFormats";
import {
  getSectionForTopic,
  getNextSection,
  markTopicCompleted,
  isTopicCompleted,
  getCompletedTopics,
  isFreeTopic
} from "../data/allTopics";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Check,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  BookOpen,
  RotateCw,
  Layers,
  Code2,
  Brain,
  Zap,
  Terminal,
  ChevronRight,
  ChevronDown,
  Trophy,
  HelpCircle,
  Play,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  StickyNote,
  Lock
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotepad } from "../context/NotepadContext";

export default function LessonContent({
  topic,
  adjacent,
  onSelectTopic,
  onBackToLearn,
  onBack,
  selectedStage = "young",
  onSelectStage,
  onOpenStageModal,
  selectedLanguage = "english",
  onSelectLanguage,
  onOpenLanguageModal
}) {
  // Lesson steps: 'understand' | 'example' | 'code' | 'practice' | 'challenge' | 'complete'
  const [currentStep, setCurrentStep] = useState("understand");
  const [selectedFormat, setSelectedFormat] = useState("simple");
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);
  const [completedTopicIds, setCompletedTopicIds] = useState(getCompletedTopics());
  const [showConfetti, setShowConfetti] = useState(false);

  const { isAuthenticated, openAuthModal, toggleBookmark, isTopicBookmarked, toggleComplete, recordQuiz } = useAuth();
  const isBookmarked = isTopicBookmarked(topic.id);
  const { openNotepad, setTopicContext } = useNotepad();

  // Practice state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Challenge & Auto-Next state
  const [showHint, setShowHint] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [autoNextCountdown, setAutoNextCountdown] = useState(null);
  const [autoNextPaused, setAutoNextPaused] = useState(false);

  const containerRef = useRef(null);

  // Load section context
  const sectionMeta = getSectionForTopic(topic.id);
  const { section, topicIndex, totalTopics, isLastInSection } = sectionMeta;
  const nextSection = isLastInSection ? getNextSection(section.id) : null;

  // Reset or initialize state when topic changes
  useEffect(() => {
    setCurrentStep("understand");
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswerChecked(false);
    setShowHint(false);
    setChallengeCompleted(false);
    setShowConfetti(false);
    setAutoNextCountdown(null);
    setAutoNextPaused(false);
    setCompletedTopicIds(getCompletedTopics());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [topic.id]);

  const isFree = isFreeTopic(topic.id);
  const canReadLesson = isAuthenticated || isFree;

  // Ensure unauthenticated users on non-free lessons are kept on 'understand'
  useEffect(() => {
    if (!canReadLesson && currentStep !== "understand") {
      setCurrentStep("understand");
    }
  }, [canReadLesson, currentStep]);

  // Resolve stage-specific content
  const stageObj =
    topic.stages?.[selectedStage] ||
    topic.stages?.young ||
    topic.stages?.college ||
    Object.values(topic.stages || {})[0] ||
    {};
  const currentStageMeta = getStageById(selectedStage);

  // Resolve language-specific content
  const langPkg =
    stageObj.languages?.[selectedLanguage] ||
    stageObj.languages?.english ||
    stageObj.languages?.["english-telugu"] ||
    Object.values(stageObj.languages || {})[0] ||
    stageObj;
  const currentLangMeta = getLanguageById(selectedLanguage);

  // Resolve narrative explanations
  const explanations = langPkg.explanations || {};
  const currentFormatMeta = getFormatById(selectedFormat);
  const activeNarrative =
    explanations[selectedFormat] ||
    explanations.simple ||
    langPkg.theory ||
    langPkg.explanation ||
    "Python makes this concept simple, clean, and reliable to understand.";

  const questions = langPkg.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const tryIt = langPkg.tryItYourself || {};

  // Extract key takeaways to offer as 1-click note additions (memoized)
  const defaultKeyPoints = React.useMemo(() => [
    langPkg.quickSummary,
    langPkg.realLifeExample,
    langPkg.theory ? `${topic.title}: ${langPkg.theory.slice(0, 90)}...` : null
  ].filter(Boolean), [langPkg.quickSummary, langPkg.realLifeExample, langPkg.theory, topic.title]);

  // Keep notepad context in sync with current lesson
  useEffect(() => {
    setTopicContext({
      topicId: topic.id,
      topicTitle: topic.title,
      defaultKeyPoints
    });
  }, [topic.id, topic.title, defaultKeyPoints, setTopicContext]);

  // Step transition helper
  const goToStep = (stepName) => {
    if (!canReadLesson && stepName !== "understand") {
      openAuthModal(
        "login",
        `Sign in or create an account to unlock interactive examples, code runner, quizzes & challenges for "${topic.title}"!`
      );
      return;
    }
    setCurrentStep(stepName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Practice handlers
  const handleCheckAnswer = () => {
    if (!selectedOption || !currentQuestion) return;
    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setAnswerChecked(true);
    if (correct) {
      playSuccessChime();
    }
  };

  const handleNextQuestion = () => {
    if (!canReadLesson) {
      openAuthModal("login", "Sign in required to proceed to the next question!");
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswerChecked(false);
      setIsCorrect(false);
    } else {
      goToStep("challenge");
    }
  };

  const handleOpenNextChapter = () => {
    setAutoNextCountdown(null);
    const nextTopicId = adjacent.next
      ? adjacent.next.id
      : nextSection && nextSection.topics[0]
      ? nextSection.topics[0].id
      : null;
    const nextTitle = adjacent.next
      ? adjacent.next.title
      : nextSection && nextSection.topics[0]
      ? nextSection.topics[0].title
      : "";

    if (!isAuthenticated && nextTopicId && !isFreeTopic(nextTopicId)) {
      openAuthModal(
        "login",
        `Except for the first 2 free preview lessons, other lessons require you to sign in or have an account. Sign in to read "${nextTitle}"!`
      );
      return;
    }

    if (adjacent.next) {
      onSelectTopic(adjacent.next.id);
    } else if (nextSection && nextSection.topics[0]) {
      onSelectTopic(nextSection.topics[0].id);
    } else {
      onBackToLearn();
    }
  };

  const handleCompleteChallenge = () => {
    setChallengeCompleted(true);
    markTopicCompleted(topic.id);
    if (isAuthenticated) {
      toggleComplete(topic.id);
      recordQuiz(topic.id, 100);
    }
    setCompletedTopicIds(getCompletedTopics());
    setShowConfetti(true);
    playCelebrationChime();
    goToStep("complete");

    // Automatically trigger next chapter countdown if next chapter is accessible
    const nextTopicId = adjacent.next
      ? adjacent.next.id
      : nextSection && nextSection.topics[0]
      ? nextSection.topics[0].id
      : null;
    if (nextTopicId && (isAuthenticated || isFreeTopic(nextTopicId))) {
      setAutoNextCountdown(4);
      setAutoNextPaused(false);
    }
  };

  // Auto-advance countdown timer
  useEffect(() => {
    const nextTopicId = adjacent.next
      ? adjacent.next.id
      : nextSection && nextSection.topics[0]
      ? nextSection.topics[0].id
      : null;
    const nextIsAccessible = isAuthenticated || (nextTopicId && isFreeTopic(nextTopicId));
    if (!nextIsAccessible || autoNextCountdown === null || autoNextPaused || currentStep !== "complete") return;

    if (autoNextCountdown <= 1) {
      const timer = setTimeout(() => {
        handleOpenNextChapter();
      }, 1000);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setAutoNextCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoNextCountdown, autoNextPaused, currentStep, adjacent.next, nextSection, isAuthenticated]);

  // Step pill definitions
  const steps = [
    { id: "understand", label: "1. Understand", icon: BookOpen },
    { id: "example", label: "2. Example", icon: Lightbulb },
    { id: "code", label: "3. Code", icon: Code2 },
    { id: "practice", label: "4. Practice", icon: CheckCircle2 },
    { id: "challenge", label: "5. Challenge", icon: Zap },
    { id: "complete", label: "6. Complete", icon: Trophy }
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progressPercent = Math.round(((topicIndex - 1 + (currentStepIndex + 1) / 6) / totalTopics) * 100);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8 pb-16 sm:pb-20 md:pb-24 w-full min-w-0 animate-in" ref={containerRef}>
      {showConfetti && <ConfettiCelebration active={showConfetti} onComplete={() => setShowConfetti(false)} />}

      {/* Top Breadcrumb & Progress Header */}
      <div className="bg-white/95 dark:bg-[#101b2d]/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-[#23344d] p-3 sm:p-5 shadow-sm mb-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
            <button
              onClick={onBack || onBackToLearn}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#14233a] hover:bg-slate-200 dark:hover:bg-[#1e3252] border border-slate-200 dark:border-[#23344d] transition cursor-pointer shadow-2xs group shrink-0 active:scale-95"
              title="Return to previous page / curriculum"
            >
              <ArrowLeft size={15} className="text-[#3b82f6] dark:text-[#60a5fa] group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={onBackToLearn}
              className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 max-w-[110px] xs:max-w-[160px] sm:max-w-[220px] truncate"
              title="Return to curriculum modules"
            >
              <span>{section.title}</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">
              Topic {topicIndex} of {totalTopics}
            </span>

            {adjacent.prev && (
              <button
                onClick={() => onSelectTopic(adjacent.prev.id)}
                className="ml-0.5 sm:ml-1 inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#14233a] hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-[#1e3252] dark:hover:text-[#93c5fd] border border-slate-200 dark:border-[#23344d] transition cursor-pointer shrink-0"
                title={`Back to: ${adjacent.prev.title}`}
              >
                <ArrowLeft size={12} />
                <span>Prev</span>
              </button>
            )}
          </div>

          {/* Current Stage, Language, Notepad & Bookmark Badges (In logical order & responsive) */}
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            {/* 1. Learning Stage */}
            <button
              onClick={onOpenStageModal}
              className="notion-tag text-xs font-bold cursor-pointer hover:border-[#3b82f6] transition flex items-center gap-1 py-1 px-2 sm:px-2.5"
              title="Change Learning Stage (Age)"
            >
              <span className="text-sm select-none">{currentStageMeta.icon}</span>
              <span className="font-semibold">{currentStageMeta.label.split(" ")[0]}</span>
            </button>

            {/* 2. Explanation Language */}
            <button
              onClick={onOpenLanguageModal}
              className="notion-tag text-xs font-bold cursor-pointer hover:border-[#3b82f6] transition flex items-center gap-1 py-1 px-2 sm:px-2.5"
              title="Change Explanation Language"
            >
              <span className="text-sm select-none">{currentLangMeta.icon}</span>
              <span className="font-semibold">{currentLangMeta.shortLabel}</span>
            </button>

            {/* 3. Study Notepad */}
            <button
              onClick={() =>
                openNotepad({
                  topicId: topic.id,
                  topicTitle: topic.title,
                  defaultKeyPoints,
                  tab: "topic"
                })
              }
              className="notion-tag text-xs font-bold cursor-pointer transition flex items-center gap-1 py-1 px-2 sm:px-2.5 bg-blue-50 dark:bg-[#14233a] text-blue-800 dark:text-[#93c5fd] border-blue-200 dark:border-[#23344d] hover:bg-blue-100 dark:hover:bg-[#1e3252] shadow-2xs"
              title="Open Study Notepad to write key points (Alt+N)"
            >
              <StickyNote size={13} className="text-[#3b82f6] dark:text-[#60a5fa] shrink-0" />
              <span className="font-semibold">Notes</span>
            </button>

            {/* 4. Bookmark / Save */}
            <button
              onClick={() => toggleBookmark(topic.id)}
              className={`notion-tag text-xs font-bold cursor-pointer transition flex items-center gap-1 py-1 px-2 sm:px-2.5 ${
                isBookmarked
                  ? "bg-blue-100 dark:bg-[#14233a] text-[#3b82f6] dark:text-[#60a5fa] border-blue-300 dark:border-[#3b82f6]"
                  : "hover:border-[#3b82f6]"
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark this Lesson"}
            >
              {isBookmarked ? (
                <BookmarkCheck size={13} className="text-[#3b82f6] dark:text-[#60a5fa] shrink-0" />
              ) : (
                <Bookmark size={13} className="shrink-0" />
              )}
              <span className="font-semibold">{isBookmarked ? "Saved" : "Save"}</span>
            </button>

            {/* 5. Contextual Page Guidance */}
            <PageHelpButton pageId="lesson" />
          </div>
        </div>

        {/* Topic Title & Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {topic.title}
          </h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-[#14233a] text-blue-700 dark:text-[#93c5fd] border border-blue-200 dark:border-[#23344d] self-start sm:self-auto shadow-2xs">
            {progressPercent}% Complete
          </span>
        </div>

        {/* Section Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-[#0c1422] h-2 rounded-full overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>

        {/* Step Navigation Pills */}
        <div id="tour-lesson-steps" className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            const isCurrent = st.id === currentStep;
            const isPassed = idx < currentStepIndex;
            const isLocked = !canReadLesson && idx > 0;

            return (
              <button
                key={st.id}
                onClick={() => goToStep(st.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer border ${
                  isCurrent
                    ? "bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white border-transparent shadow-sm shadow-blue-500/25"
                    : isPassed
                    ? "bg-blue-50 dark:bg-[#14233a] text-blue-800 dark:text-[#93c5fd] border-blue-200 dark:border-[#23344d]"
                    : "bg-white dark:bg-[#101b2d] text-slate-600 dark:text-[#cbd5e1] border-slate-200 dark:border-[#23344d] hover:bg-slate-100 dark:hover:bg-[#14233a]"
                }`}
                title={isLocked ? "Sign in required to access this step" : ""}
              >
                {isPassed ? (
                  <Check size={14} className="text-[#3b82f6] dark:text-[#60a5fa]" />
                ) : isLocked ? (
                  <Lock size={13} className="text-amber-500 dark:text-amber-400 shrink-0" />
                ) : (
                  <Icon size={14} />
                )}
                <span>{st.label}</span>
                {isLocked && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 font-extrabold ml-0.5">
                    Locked
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout (Learning Path Sidebar + Step Content) */}
      <div id="tour-lesson-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
        {/* Left Learning Path Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-4 bg-white dark:bg-[#101b2d] rounded-2xl border border-slate-200 dark:border-[#23344d] p-4 shadow-sm sticky top-48">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-[#23344d]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] dark:text-[#60a5fa]">
                Curriculum Path
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[190px]">
                {section.title}
              </h3>
            </div>
            <ProgressRing percentage={progressPercent} size={42} strokeWidth={4} />
          </div>

          <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 scrollbar-thin">
            {section.topics.map((t, idx) => {
              const isCurrentTopic = t.id === topic.id;
              const isCompleted = completedTopicIds.includes(t.id);
              const isTopicFree = isFreeTopic(t.id);
              const isTopicLocked = !isAuthenticated && !isTopicFree;

              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTopic(t.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition cursor-pointer border-none ${
                    isCurrentTopic
                      ? "bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white shadow-xs"
                      : isCompleted
                      ? "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#14233a]"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#14233a] hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {isCompleted ? (
                      <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-[#14233a] text-[#3b82f6] dark:text-[#60a5fa] border border-blue-200 dark:border-[#23344d] flex items-center justify-center shrink-0">
                        <Check size={12} />
                      </span>
                    ) : isCurrentTopic ? (
                      <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#14233a] text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs shrink-0 font-bold">
                        {idx + 1}
                      </span>
                    )}
                    <span className="truncate">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isTopicLocked && <Lock size={12} className="text-amber-500 opacity-80" />}
                    {isTopicFree && !isCompleted && !isCurrentTopic && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">Free</span>
                    )}
                    {isCurrentTopic && <ChevronRight size={16} className="text-white shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Step Content Container */}
        <main className="lg:col-span-8 space-y-6 min-w-0 w-full">
          {/* =======================================================
              STEP 1: 📖 UNDERSTAND
              ======================================================= */}
          {currentStep === "understand" && (
            <div className="bg-white dark:bg-[#101b2d] rounded-2xl border border-slate-200 dark:border-[#23344d] p-5 sm:p-8 shadow-sm space-y-6 animate-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#23344d]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#14233a] text-[#3b82f6] dark:text-[#60a5fa] border border-blue-200 dark:border-[#23344d] flex items-center justify-center shadow-xs">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] dark:text-[#60a5fa]">
                      Step 1 of 6
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Understand the Concept</h2>
                  </div>
                </div>

                {/* Another Explanation Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setFormatMenuOpen(!formatMenuOpen)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-[#14233a] hover:bg-slate-200 dark:hover:bg-[#1e3252] text-slate-800 dark:text-[#f8fafc] transition cursor-pointer border border-slate-200 dark:border-[#23344d] shadow-2xs"
                  >
                    <RotateCw size={14} className="text-[#3b82f6] dark:text-[#60a5fa]" />
                    <span>{currentFormatMeta?.label || "Another Explanation"}</span>
                    <ChevronDown size={14} />
                  </button>

                  {formatMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#101b2d] rounded-2xl shadow-xl border border-slate-200 dark:border-[#23344d] p-2 z-30 animate-in">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#94a3b8] px-3 py-1.5 block">
                        Choose Explanation Style:
                      </span>
                      {EXPLANATION_FORMATS.map((fmt) => (
                        <button
                          key={fmt.id}
                          onClick={() => {
                            setSelectedFormat(fmt.id);
                            setFormatMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition cursor-pointer border-none ${
                            selectedFormat === fmt.id
                              ? "bg-blue-50 dark:bg-[#14233a] text-[#2563eb] dark:text-[#60a5fa] font-bold"
                              : "text-slate-700 dark:text-[#cbd5e1] hover:bg-slate-100 dark:hover:bg-[#14233a]"
                          }`}
                        >
                          <span className="text-base">{fmt.icon}</span>
                          <span>{fmt.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* What is it? & Why do we need it? Callouts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {langPkg.whatIsIt && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 dark:bg-[#14233a] border border-blue-200 dark:border-[#23344d] flex items-start gap-3">
                    <span className="text-2xl select-none">💡</span>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb] dark:text-[#60a5fa] block mb-1">
                        What is it?
                      </span>
                      <p className="text-sm sm:text-base text-slate-800 dark:text-[#f8fafc] leading-relaxed font-normal m-0">
                        {langPkg.whatIsIt}
                      </p>
                    </div>
                  </div>
                )}
                {langPkg.whyDoWeNeedIt && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 dark:bg-[#14233a] border border-blue-200 dark:border-[#23344d] flex items-start gap-3">
                    <span className="text-2xl select-none">🎯</span>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb] dark:text-[#60a5fa] block mb-1">
                        Why do we need it?
                      </span>
                      <p className="text-sm sm:text-base text-slate-800 dark:text-[#f8fafc] leading-relaxed font-normal m-0">
                        {langPkg.whyDoWeNeedIt}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Narrative Explanation */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#14233a] border border-slate-200 dark:border-[#23344d]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] dark:text-[#60a5fa] block mb-2">
                  Detailed Explanation:
                </span>
                <p className="body-base text-slate-800 dark:text-[#f8fafc] leading-relaxed whitespace-pre-line m-0">
                  {activeNarrative}
                </p>
              </div>

              {/* Important Points */}
              {langPkg.importantPoints && langPkg.importantPoints.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 dark:bg-[#14233a] border border-blue-200 dark:border-[#23344d] flex items-start gap-3">
                  <span className="text-2xl select-none">✨</span>
                  <div className="space-y-2 w-full">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb] dark:text-[#60a5fa] block">
                      Important Points to Remember:
                    </span>
                    <ul className="space-y-1.5 text-sm sm:text-base text-slate-800 dark:text-[#f8fafc] m-0 p-0 list-none">
                      {langPkg.importantPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check size={16} className="text-[#3b82f6] dark:text-[#60a5fa] shrink-0 mt-1" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#23344d] flex flex-wrap items-center justify-between gap-3">
                {adjacent.prev ? (
                  <button
                    onClick={() => onSelectTopic(adjacent.prev.id)}
                    className="btn-vibrant-secondary w-full sm:w-auto"
                    title={`Go back to ${adjacent.prev.title}`}
                  >
                    <ArrowLeft size={16} />
                    <span>Previous: "{adjacent.prev.title}"</span>
                  </button>
                ) : (
                  <button
                    onClick={onBackToLearn}
                    className="btn-vibrant-secondary w-full sm:w-auto"
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Curriculum</span>
                  </button>
                )}

                <button
                  onClick={() => goToStep("example")}
                  className="btn-vibrant-primary w-full sm:w-auto"
                >
                  {!canReadLesson && <Lock size={16} className="text-white/80" />}
                  <span>{canReadLesson ? "Continue to Example" : "Sign In to Continue to Example"}</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Free Preview Notification Banner for visitors */}
              {!isAuthenticated && isFree && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-blue-500/10 border border-emerald-300/40 dark:border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-[#168BFF] flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Free Preview Lesson
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-[#91A6BF]">
                        You can read the first 2 lessons for free! Create an account or sign in to unlock all other lessons across the entire curriculum.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      openAuthModal(
                        "signup",
                        "Create a free account to unlock all other lessons and track your learning progress!"
                      )
                    }
                    className="btn-vibrant-primary px-4 py-2 text-xs sm:text-sm shrink-0 whitespace-nowrap"
                  >
                    <span>Sign Up to Unlock All Lessons</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}

              {/* Guest Progression Notice Banner if not free */}
              {!isAuthenticated && !isFree && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 border border-blue-300/40 dark:border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#168BFF] to-[#0876E8] flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Lock size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Unlock All Next Steps & Live Code Exercises
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-[#91A6BF]">
                        Sign in or register to read this lesson, run Python code, take practice quizzes, and advance to next chapters.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      openAuthModal(
                        "login",
                        "Sign in to unlock interactive examples, code runner, and next chapters!"
                      )
                    }
                    className="btn-vibrant-primary px-4 py-2 text-xs sm:text-sm shrink-0 whitespace-nowrap"
                  >
                    <Lock size={14} />
                    <span>Sign In to Proceed</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =======================================================
              STEP 2: 💡 SEE AN EXAMPLE & VISUAL
              ======================================================= */}
          {currentStep === "example" && (
            <div className="bg-white dark:bg-[#101b2d] rounded-2xl border border-slate-200 dark:border-[#23344d] p-5 sm:p-8 shadow-sm space-y-6 animate-in">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-[#23344d]">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#14233a] text-[#3b82f6] dark:text-[#60a5fa] border border-blue-200 dark:border-[#23344d] flex items-center justify-center shadow-xs">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] dark:text-[#60a5fa]">
                    Step 2 of 6
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Real-Life Example & Visual</h2>
                </div>
              </div>

              {/* Real-Life Metaphor Card */}
              {langPkg.realLifeExample && (
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 dark:bg-[#14233a] border border-blue-200 dark:border-[#23344d] flex items-start gap-3">
                  <span className="text-2xl select-none">🌍</span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb] dark:text-[#60a5fa] block mb-1">
                      Real-Life Situation:
                    </span>
                    <p className="body-base text-slate-800 dark:text-[#f8fafc] leading-relaxed m-0">
                      {langPkg.realLifeExample}
                    </p>
                  </div>
                </div>
              )}

              {/* Visual Diagram */}
              {stageObj.visual && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] dark:text-[#60a5fa] block">
                    Visual Diagram:
                  </span>
                  <VisualExplanation visual={stageObj.visual} selectedStage={selectedStage} />
                </div>
              )}

              {/* Common Mistakes & Fixes */}
              {langPkg.commonMistakes && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#14233a] border border-slate-200 dark:border-[#23344d] flex items-start gap-3">
                  <span className="text-2xl select-none">💡</span>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#38bdf8] dark:text-[#60a5fa] block">
                      Common Mistake to Avoid:
                    </span>
                    <p className="text-sm sm:text-base text-slate-900 dark:text-[#f8fafc] font-semibold m-0">
                      {langPkg.commonMistakes.mistake}
                    </p>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-[#cbd5e1] m-0">
                      💡 <strong>Fix:</strong> {langPkg.commonMistakes.fix}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#23344d] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => goToStep("understand")}
                  className="btn-vibrant-secondary w-full sm:w-auto"
                >
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => goToStep("code")}
                  className="btn-vibrant-primary w-full sm:w-auto"
                >
                  <span>Continue to Python Code</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* =======================================================
              STEP 3: 🐍 LIVE PYTHON CODE RUNNER
              ======================================================= */}
          {currentStep === "code" && (
            <div className="bg-white dark:bg-[#101b2d] rounded-2xl border border-slate-200 dark:border-[#23344d] p-5 sm:p-8 shadow-sm space-y-6 animate-in">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-[#23344d]">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#14233a] text-[#3b82f6] dark:text-[#60a5fa] border border-blue-200 dark:border-[#23344d] flex items-center justify-center shadow-xs">
                  <Code2 size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] dark:text-[#60a5fa]">
                    Step 3 of 6
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Live Python Code & Runner</h2>
                </div>
              </div>

              {/* Interactive In-Browser Python Runner */}
              <div id="tour-lesson-runner" className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] dark:text-[#60a5fa] flex items-center gap-1.5">
                  <Play size={14} />
                  Interactive Code Playground (Edit & Run Live):
                </span>
                <LivePythonRunner
                  initialCode={langPkg.code || 'print("Hello Python!")'}
                  expectedOutput={langPkg.output || 'Hello Python!'}
                  title="Live Python Code Editor"
                />
              </div>

              {/* How it Works */}
              {langPkg.howItWorks && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#14233a] border border-slate-200 dark:border-[#23344d]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] dark:text-[#60a5fa] block mb-1.5">
                    How it works under the hood:
                  </span>
                  <p className="body-base text-slate-800 dark:text-[#f8fafc] leading-relaxed m-0">
                    {langPkg.howItWorks}
                  </p>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#23344d] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => goToStep("example")}
                  className="btn-vibrant-secondary w-full sm:w-auto"
                >
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => goToStep("practice")}
                  className="btn-vibrant-primary w-full sm:w-auto"
                >
                  <span>Try It & Practice</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* =======================================================
              STEP 4: 📝 PRACTICE
              ======================================================= */}
          {currentStep === "practice" && (
            <div className="bg-white dark:bg-[#101b2d] rounded-2xl border border-slate-200 dark:border-[#23344d] p-5 sm:p-8 shadow-sm space-y-6 animate-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#23344d]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#14233a] text-[#3b82f6] dark:text-[#60a5fa] border border-blue-200 dark:border-[#23344d] flex items-center justify-center shadow-xs">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] dark:text-[#60a5fa]">
                      Step 4 of 6
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Practice Quiz</h2>
                  </div>
                </div>

                {questions.length > 0 && (
                  <span className="notion-tag font-mono text-xs font-bold text-[#3b82f6] dark:text-[#93c5fd] bg-blue-50 dark:bg-[#14233a] border border-blue-200 dark:border-[#23344d]">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                )}
              </div>

              {/* Render Question One by One */}
              {currentQuestion ? (
                <div className="space-y-5">
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#14233a] border border-slate-200 dark:border-[#23344d]">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug m-0">
                      {currentQuestion.question}
                    </h3>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {currentQuestion.options?.map((opt, i) => {
                      const isSelected = selectedOption === opt;
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (!answerChecked) {
                              setSelectedOption(opt);
                            }
                          }}
                          className={`w-full text-left p-3.5 sm:p-4 rounded-xl text-sm sm:text-base font-semibold flex items-center gap-3 transition cursor-pointer border ${
                            isSelected
                              ? "bg-blue-50 dark:bg-[#14233a] border-[#3b82f6] text-blue-900 dark:text-[#f8fafc] shadow-xs"
                              : "bg-white dark:bg-[#0c1422] border-slate-200 dark:border-[#23344d] text-slate-800 dark:text-[#cbd5e1] hover:bg-slate-50 dark:hover:bg-[#14233a]"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                              isSelected
                                ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                                : "border-slate-300 dark:border-[#23344d] text-slate-500 dark:text-[#94a3b8]"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="flex-1 break-words">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Answer Feedback */}
                  {answerChecked && (
                    <div
                      className={`p-4 rounded-2xl border flex items-start gap-3 ${
                        isCorrect
                          ? "bg-blue-50/80 dark:bg-[#14233a] border-blue-300 dark:border-[#3b82f6] text-blue-900 dark:text-[#f8fafc]"
                          : "bg-slate-50 dark:bg-[#14233a] border-slate-200 dark:border-[#23344d] text-slate-800 dark:text-[#cbd5e1]"
                      }`}
                    >
                      <span className="text-xl select-none">{isCorrect ? "✓" : "ℹ"}</span>
                      <div className="space-y-1">
                        <span className="text-sm font-bold block">
                          {isCorrect ? "Correct! Excellent job." : "Not quite. Review explanation below:"}
                        </span>
                        <p className="body-base leading-relaxed m-0">{currentQuestion.explanation}</p>
                      </div>
                    </div>
                  )}

                  {/* Practice Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 dark:border-[#23344d] flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => goToStep("code")}
                      className="btn-vibrant-secondary w-full sm:w-auto"
                    >
                      <ArrowLeft size={16} />
                      <span>Back to Code</span>
                    </button>

                    {!answerChecked ? (
                      <button
                        onClick={handleCheckAnswer}
                        disabled={!selectedOption}
                        className="btn-vibrant-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="btn-vibrant-primary w-full sm:w-auto"
                      >
                        <span>
                          {currentQuestionIndex < questions.length - 1
                            ? "Next Question →"
                            : "Continue to Challenge →"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <p className="text-slate-600 dark:text-[#94a3b8] text-base">Practice questions completed for this topic!</p>
                  <button
                    onClick={() => goToStep("challenge")}
                    className="btn-vibrant-primary w-full sm:w-auto"
                  >
                    Go to Challenge →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =======================================================
              STEP 5: 🔥 HANDS-ON CHALLENGE (LIVE RUNNER)
              ======================================================= */}
          {currentStep === "challenge" && (
            <div className="bg-white dark:bg-[#101b2d] rounded-2xl border border-slate-200 dark:border-[#23344d] p-5 sm:p-8 shadow-sm space-y-6 animate-in">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-[#23344d]">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#14233a] text-[#3b82f6] dark:text-[#60a5fa] border border-blue-200 dark:border-[#23344d] flex items-center justify-center shadow-xs">
                  <Zap size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] dark:text-[#60a5fa]">
                    Step 5 of 6
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Hands-on Challenge</h2>
                </div>
              </div>

              {/* Challenge Goal & Task */}
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 dark:bg-[#14233a] border border-blue-200 dark:border-[#23344d] flex items-start gap-3">
                <span className="text-2xl select-none">🎯</span>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb] dark:text-[#60a5fa] block">
                    Challenge Objective:
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white m-0">
                    {tryIt.goal || `Write code to put ${topic.title} into practice.`}
                  </p>
                  <p className="body-base text-slate-600 dark:text-[#cbd5e1] leading-relaxed m-0">
                    {tryIt.task || "Run the solution in the interactive playground below."}
                  </p>
                </div>
              </div>

              {/* Live Interactive Challenge Runner */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] dark:text-[#60a5fa] block mb-2">
                  Interactive Challenge Workspace:
                </span>
                <LivePythonRunner
                  initialCode={tryIt.solution || tryIt.starterCode || langPkg.code}
                  expectedOutput={tryIt.expectedOutput || langPkg.output}
                  title="Challenge Playground"
                />
              </div>

              {/* Optional Hint Toggle */}
              <div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-50 dark:bg-[#14233a] text-blue-800 dark:text-[#93c5fd] border border-blue-200 dark:border-[#23344d] hover:bg-blue-100 dark:hover:bg-[#1e3252] transition cursor-pointer flex items-center gap-1.5"
                >
                  <Lightbulb size={14} className="text-[#3b82f6] dark:text-[#60a5fa]" />
                  <span>{showHint ? "Hide Hint" : "💡 Show Hint"}</span>
                </button>

                {showHint && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-blue-50/60 dark:bg-[#14233a] border border-blue-200 dark:border-[#23344d] text-blue-900 dark:text-[#93c5fd] animate-in flex items-start gap-2.5">
                    <span className="text-xl select-none">💡</span>
                    <p className="body-base text-slate-800 dark:text-[#f8fafc] m-0 font-medium">
                      {tryIt.hint || "Make sure your syntax has matching parentheses and quotes."}
                    </p>
                  </div>
                )}
              </div>

              {/* Challenge Completion Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#23344d] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => goToStep("practice")}
                  className="btn-vibrant-secondary w-full sm:w-auto"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Practice</span>
                </button>

                <button
                  onClick={handleCompleteChallenge}
                  className="btn-vibrant-primary w-full sm:w-auto"
                >
                  <span>Complete Challenge & Finish</span>
                  <CheckCircle2 size={18} />
                </button>
              </div>
            </div>
          )}

          {/* =======================================================
              STEP 6: 🎉 TOPIC COMPLETE & SECTION TRANSITION
              ======================================================= */}
          {currentStep === "complete" && (
            <div className="bg-white dark:bg-[#101b2d] rounded-2xl border border-slate-200 dark:border-[#23344d] p-6 sm:p-10 shadow-sm text-center space-y-6 animate-in">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-[#14233a] text-[#3b82f6] dark:text-[#60a5fa] border border-blue-200 dark:border-[#23344d] flex items-center justify-center shadow-md">
                <Trophy size={32} />
              </div>

              <div>
                <span className="notion-tag text-[#3b82f6] dark:text-[#60a5fa] bg-blue-50 dark:bg-[#14233a] border border-blue-200 dark:border-[#23344d] font-bold mb-2 inline-block">
                  Topic Mastered
                </span>
                <h2 className="heading-section text-slate-900 dark:text-white mt-2">
                  "{topic.title}" Complete!
                </h2>
                <p className="body-base text-slate-600 dark:text-[#cbd5e1] max-w-md mx-auto mt-2 leading-relaxed">
                  You successfully understood the core concepts, studied real-world examples, verified live Python code, answered practice questions, and completed the hands-on challenge.
                </p>
              </div>

              {/* Automatic Next Chapter Countdown Indicator */}
              {(adjacent.next || (nextSection && nextSection.topics[0])) && autoNextCountdown !== null && (
                <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-blue-50 dark:bg-[#14233a] border border-blue-200 dark:border-[#23344d] flex items-center justify-between gap-3 animate-pulse">
                  <div className="flex items-center gap-2.5 text-left min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#3b82f6] text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-sm">
                      {autoNextCountdown}s
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                        Opening next: "{adjacent.next ? adjacent.next.title : nextSection.topics[0].title}"
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Auto-advancing to next chapter...
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setAutoNextPaused(!autoNextPaused)}
                      className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0c1422] border border-slate-200 dark:border-[#23344d] hover:bg-slate-100 dark:hover:bg-[#101b2d] transition cursor-pointer"
                    >
                      {autoNextPaused ? "Resume" : "Pause"}
                    </button>
                    <button
                      onClick={() => setAutoNextCountdown(null)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0c1422] border border-slate-200 dark:border-[#23344d] transition cursor-pointer"
                      title="Stay on this lesson"
                    >
                      Stay Here
                    </button>
                  </div>
                </div>
              )}

              {/* All Chapters Done Message if final chapter */}
              {!adjacent.next && !nextSection && (
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-blue-50 dark:bg-[#14233a] border border-blue-200 dark:border-[#3b82f6]">
                  <div className="text-xl font-extrabold text-blue-900 dark:text-white mb-1 flex items-center justify-center gap-2">
                    <Sparkles size={20} className="text-[#3b82f6] dark:text-[#60a5fa]" />
                    <span>🎉 I AM DONE! 🎉</span>
                  </div>
                  <p className="text-xs text-blue-800 dark:text-[#cbd5e1] font-semibold">
                    Congratulations! You have successfully finished all Python chapters!
                  </p>
                </div>
              )}

              {/* Completion Checklist */}
              <div className="max-w-md mx-auto p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#14233a] border border-slate-200 dark:border-[#23344d] text-left space-y-2 text-sm sm:text-base text-slate-800 dark:text-[#f8fafc] font-semibold">
                <div className="flex items-center gap-2.5 text-[#3b82f6] dark:text-[#60a5fa]">
                  <Check size={16} />
                  <span>Understood Concept & Logic</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#3b82f6] dark:text-[#60a5fa]">
                  <Check size={16} />
                  <span>Visual & Real-Life Metaphor</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#3b82f6] dark:text-[#60a5fa]">
                  <Check size={16} />
                  <span>Python Live Runner Execution</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#3b82f6] dark:text-[#60a5fa]">
                  <Check size={16} />
                  <span>Completed Practice Quiz</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#3b82f6] dark:text-[#60a5fa]">
                  <Check size={16} />
                  <span>Conquered the Challenge (+30 XP)</span>
                </div>
              </div>

              {/* Primary Navigation Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#23344d] flex flex-col items-center gap-3">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                  {adjacent.prev && (
                    <button
                      onClick={() => onSelectTopic(adjacent.prev.id)}
                      className="btn-vibrant-secondary w-full sm:w-auto"
                      title={`Go back to ${adjacent.prev.title}`}
                    >
                      <ArrowLeft size={18} />
                      <span>Previous Chapter: "{adjacent.prev.title}"</span>
                    </button>
                  )}

                  {adjacent.next ? (
                    <button
                      onClick={handleOpenNextChapter}
                      className="btn-vibrant-primary w-full sm:w-auto"
                    >
                      {!isAuthenticated && !isFreeTopic(adjacent.next.id) && <Lock size={16} className="text-white/80" />}
                      <span>
                        {!isAuthenticated && !isFreeTopic(adjacent.next.id)
                          ? `Sign In to Read Next Chapter: "${adjacent.next.title}"`
                          : `Open Next Chapter: "${adjacent.next.title}"`}
                      </span>
                      <ArrowRight size={18} />
                    </button>
                  ) : nextSection ? (
                    <button
                      onClick={handleOpenNextChapter}
                      className="btn-vibrant-primary w-full sm:w-auto"
                    >
                      {!isAuthenticated && !isFreeTopic(nextSection.topics[0]?.id) && <Lock size={16} className="text-white/80" />}
                      <span>
                        {!isAuthenticated && !isFreeTopic(nextSection.topics[0]?.id)
                          ? `Sign In to Read Next Section: "${nextSection.title}"`
                          : `Start Next Section: "${nextSection.title}"`}
                      </span>
                      <ArrowRight size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={onBackToLearn}
                      className="btn-vibrant-primary w-full sm:w-auto"
                    >
                      <span>🏆 I am done! Back to Curriculum</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => goToStep("understand")}
                  className="text-xs sm:text-sm text-slate-500 dark:text-[#94a3b8] hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition cursor-pointer bg-transparent border-none py-1 font-semibold"
                >
                  Review this topic again
                </button>
              </div>
            </div>
          )}

          {/* Persistent Topic Notes Section for noting important points */}
          <div className="pt-2">
            <TopicNotes
              topicId={topic.id}
              topicTitle={topic.title}
              defaultKeyPoints={defaultKeyPoints}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
