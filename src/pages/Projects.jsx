import React, { useState, useMemo } from "react";
import { projectsData } from "../data/projectsData";
import { LEARNING_STAGES, getStageById } from "../data/learningStages";
import { getLanguageById } from "../data/learningLanguages";
import ProjectCard from "../components/ProjectCard";
import PageBackButton from "../components/PageBackButton";
import { PageHelpButton } from "../components/GuideTutorial/ContextualPageGuidance";
import { FolderGit2, Sparkles, Folder, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Projects({
  selectedStage = "young",
  onOpenStageModal,
  selectedLanguage = "english",
  onOpenLanguageModal,
  onBack
}) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [activeStageFilter, setActiveStageFilter] = useState(selectedStage);
  const currentStageMeta = getStageById(selectedStage);
  const currentLangMeta = getLanguageById(selectedLanguage);

  const filteredProjects = useMemo(() => {
    if (activeStageFilter === "all") return projectsData;
    return projectsData.filter((p) => p.stage === activeStageFilter);
  }, [activeStageFilter]);

  return (
    <div className="projects-page max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 md:py-10 pb-16 sm:pb-20 md:pb-24 w-full min-w-0 animate-in">
      {/* Back Navigation Button */}
      {onBack && (
        <div className="mb-3 sm:mb-4 flex items-center justify-start">
          <PageBackButton onBack={onBack} label="Back" />
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-4">
          <div className="notion-tag text-xs sm:text-sm bg-slate-100 dark:bg-[#102541] border-slate-200 dark:border-[#183657]">
            <span className="text-slate-500 dark:text-[#91A6BF]">Stage:</span>
            <button
              onClick={onOpenStageModal}
              className="font-bold text-[#168BFF] dark:text-[#60B7FF] hover:underline cursor-pointer bg-transparent border-none p-0 ml-1"
            >
              {currentStageMeta.icon} {currentStageMeta.label} ({currentStageMeta.ageRange})
            </button>
          </div>

          <div className="notion-tag text-xs sm:text-sm bg-slate-100 dark:bg-[#102541] border-slate-200 dark:border-[#183657]">
            <span className="text-slate-500 dark:text-[#91A6BF]">Language:</span>
            <button
              onClick={onOpenLanguageModal}
              className="font-bold text-[#168BFF] dark:text-[#60B7FF] hover:underline cursor-pointer bg-transparent border-none p-0 ml-1"
            >
              {currentLangMeta.icon} {currentLangMeta.label}
            </button>
          </div>

          <PageHelpButton pageId="projects" />
        </div>

        <h1 className="heading-hero text-slate-900 dark:text-white mb-3">
          Age-Adapted Python Projects
        </h1>
        <p className="body-large text-slate-600 dark:text-[#D2DEEC] leading-relaxed">
          From fun toy bots for kids to production FastAPI microservices for professionals—build real software tailored to your stage.
        </p>
      </div>

      {/* Sign In Required Notice if visitor */}
      {!isAuthenticated && (
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 border border-blue-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#168BFF] to-[#0876E8] flex items-center justify-center text-white shrink-0 shadow-sm">
              <Lock size={18} />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Sign In Required for Real-World Projects
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#91A6BF]">
                Sign in to inspect project specifications, test requirements, and full architecture code.
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              openAuthModal("login", "Sign in required to view project specifications, test steps, and solution code!")
            }
            className="btn-vibrant-primary px-4 py-2 text-xs sm:text-sm shrink-0 whitespace-nowrap"
          >
            <Lock size={14} />
            <span>Sign In to Unlock Projects</span>
          </button>
        </div>
      )}

      {/* Stage Filter Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-thin">
        <button
          onClick={() => setActiveStageFilter("all")}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer border ${
            activeStageFilter === "all"
              ? "bg-gradient-to-r from-[#168BFF] to-[#0876E8] text-white border-transparent shadow-sm shadow-blue-500/25"
              : "bg-white dark:bg-[#0C1B30] text-slate-700 dark:text-[#D2DEEC] hover:bg-slate-100 dark:hover:bg-[#102541] border-slate-200 dark:border-[#183657]"
          }`}
        >
          All 25 Projects
        </button>

        {LEARNING_STAGES.map((st) => {
          const count = projectsData.filter((p) => p.stage === st.id).length;
          return (
            <button
              key={st.id}
              onClick={() => setActiveStageFilter(st.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer border ${
                activeStageFilter === st.id
                  ? "bg-gradient-to-r from-[#168BFF] to-[#0876E8] text-white border-transparent shadow-sm shadow-blue-500/25"
                  : "bg-white dark:bg-[#0C1B30] text-slate-700 dark:text-[#D2DEEC] hover:bg-slate-100 dark:hover:bg-[#102541] border-slate-200 dark:border-[#183657]"
              }`}
            >
              <span>{st.icon}</span>
              <span>{st.label} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
