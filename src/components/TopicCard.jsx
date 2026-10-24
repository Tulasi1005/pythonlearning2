import React from "react";
import { ArrowRight, BookOpen, FileText, Lock, Sparkles } from "lucide-react";
import { getStageById } from "../data/learningStages";
import { getLanguageById } from "../data/learningLanguages";
import { isFreeTopic } from "../data/allTopics";
import { useAuth } from "../context/AuthContext";

export default function TopicCard({
  topic,
  onSelect,
  onSelectTopic,
  selectedStage = "young",
  selectedLanguage = "english"
}) {
  const { isAuthenticated } = useAuth();
  const selectHandler = onSelectTopic || onSelect;
  const stageData = topic.stages?.[selectedStage] || topic.stages?.young || topic;
  const langData = stageData.languages?.[selectedLanguage] || stageData.languages?.english || stageData;
  const stageMeta = getStageById(selectedStage);
  const langMeta = getLanguageById(selectedLanguage);
  const isFree = isFreeTopic(topic.id);
  const isLocked = !isAuthenticated && !isFree;

  const previewText =
    langData.intro ||
    stageData.intro ||
    topic.shortDescription ||
    "Learn and master this core Python concept.";

  return (
    <div
      onClick={() => selectHandler && selectHandler(topic.id)}
      className="modern-card group p-5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-blue-600 dark:text-[#8CC8FF] bg-blue-50 dark:bg-[#102541] border border-blue-200 dark:border-[#183657] px-2.5 py-0.5 rounded-full">
              #{topic.topicNumber}
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
          <span className="text-xs font-semibold text-slate-500 dark:text-[#91A6BF] truncate max-w-[130px]">
            {topic.sectionTitle?.split("—")[1]?.trim() || topic.sectionId}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#168BFF] dark:group-hover:text-[#60B7FF] transition-colors leading-snug mb-2">
          {topic.title}
        </h3>

        <p className="text-slate-600 dark:text-[#D2DEEC] text-sm line-clamp-2 leading-relaxed mb-3">
          {previewText}
        </p>
      </div>

      <div className="mt-2 pt-3 border-t border-slate-200 dark:border-[#183657] flex items-center justify-between text-xs sm:text-sm font-bold text-[#168BFF]">
        <span className="flex items-center gap-1.5 text-slate-500 dark:text-[#91A6BF] font-semibold">
          <FileText size={14} />
          <span>{stageMeta.label} • {langMeta.shortLabel}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className={isLocked ? "text-amber-600 dark:text-amber-400" : ""}>
            {isLocked ? "Sign In to Read" : "Read Lesson"}
          </span>
          {isLocked ? (
            <Lock size={14} className="text-amber-500 shrink-0" />
          ) : (
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#168BFF]" />
          )}
        </div>
      </div>
    </div>
  );
}
