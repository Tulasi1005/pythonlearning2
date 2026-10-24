import { pythonBasics } from "./pythonBasics.js";
import { operators } from "./operators.js";
import { conditions } from "./conditions.js";
import { loops } from "./loops.js";
import { strings } from "./strings.js";
import { lists } from "./lists.js";
import { tuplesSetsDicts } from "./tuplesSetsDicts.js";
import { functions } from "./functions.js";
import { modules } from "./modules.js";
import { exceptions } from "./exceptions.js";
import { oop } from "./oop.js";
import { files } from "./files.js";
import { advanced } from "./advanced.js";
import { databases } from "./databases.js";
import { apis } from "./apis.js";
import { webDevelopment } from "./webDevelopment.js";
import { dataAnalysis } from "./dataAnalysis.js";
import { machineLearning } from "./machineLearning.js";
import { ai } from "./ai.js";

export const SECTIONS = [
  { id: "python-basics", number: 1, title: "Section 1 — Python Basics", icon: "Code2", topics: pythonBasics || [] },
  { id: "operators", number: 2, title: "Section 2 — Operators", icon: "Binary", topics: operators || [] },
  { id: "conditions", number: 3, title: "Section 3 — Conditions", icon: "Split", topics: conditions || [] },
  { id: "loops", number: 4, title: "Section 4 — Loops", icon: "Repeat", topics: loops || [] },
  { id: "strings", number: 5, title: "Section 5 — Strings", icon: "Type", topics: strings || [] },
  { id: "lists", number: 6, title: "Section 6 — Lists", icon: "Layers", topics: lists || [] },
  { id: "tuples-sets-dicts", number: 7, title: "Section 7 — Tuples, Sets and Dictionaries", icon: "Boxes", topics: tuplesSetsDicts || [] },
  { id: "functions", number: 8, title: "Section 8 — Functions", icon: "Boxes", topics: functions || [] },
  { id: "modules", number: 9, title: "Section 9 — Modules and Packages", icon: "PackageCheck", topics: modules || [] },
  { id: "exceptions", number: 10, title: "Section 10 — Error Handling", icon: "AlertTriangle", topics: exceptions || [] },
  { id: "oop", number: 11, title: "Section 11 — OOP", icon: "Cpu", topics: oop || [] },
  { id: "files", number: 12, title: "Section 12 — File Handling", icon: "FileText", topics: files || [] },
  { id: "advanced", number: 13, title: "Section 13 — Advanced Python", icon: "Zap", topics: advanced || [] },
  { id: "databases", number: 14, title: "Section 14 — Databases", icon: "Database", topics: databases || [] },
  { id: "apis", number: 15, title: "Section 15 — APIs", icon: "Globe", topics: apis || [] },
  { id: "web-development", number: 16, title: "Section 16 — Web Development", icon: "Layout", topics: webDevelopment || [] },
  { id: "data-analysis", number: 17, title: "Section 17 — Data Analysis", icon: "BarChart3", topics: dataAnalysis || [] },
  { id: "machine-learning", number: 18, title: "Section 18 — Machine Learning", icon: "Brain", topics: machineLearning || [] },
  { id: "ai", number: 19, title: "Section 19 — AI", icon: "Sparkles", topics: ai || [] }
];

export const allTopics = SECTIONS.flatMap((sec) => sec.topics);

export const FREE_TOPIC_COUNT = 2;

export function isFreeTopic(topicId) {
  if (!topicId) return false;
  const index = allTopics.findIndex((t) => t.id === topicId);
  return index >= 0 && index < FREE_TOPIC_COUNT;
}

export function getTopicById(id) {
  return allTopics.find((t) => t.id === id);
}

export function getAdjacentTopics(currentId) {
  const index = allTopics.findIndex((t) => t.id === currentId);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? allTopics[index - 1] : null,
    next: index < allTopics.length - 1 ? allTopics[index + 1] : null
  };
}

export function getSectionForTopic(topicId) {
  for (const section of SECTIONS) {
    if (section.topics.some((t) => t.id === topicId)) {
      const topicIndex = section.topics.findIndex((t) => t.id === topicId);
      return {
        section,
        topicIndex: topicIndex + 1,
        totalTopics: section.topics.length,
        isLastInSection: topicIndex === section.topics.length - 1
      };
    }
  }
  return {
    section: SECTIONS[0],
    topicIndex: 1,
    totalTopics: SECTIONS[0].topics.length,
    isLastInSection: false
  };
}

export function getNextSection(currentSectionId) {
  const currentIndex = SECTIONS.findIndex((s) => s.id === currentSectionId);
  if (currentIndex !== -1 && currentIndex < SECTIONS.length - 1) {
    return SECTIONS[currentIndex + 1];
  }
  return null;
}

const COMPLETED_TOPICS_KEY = "python_completed_topics";

export function getCompletedTopics() {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(COMPLETED_TOPICS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return [];
}

export function markTopicCompleted(topicId) {
  if (!topicId || typeof window === "undefined") return;
  try {
    const list = getCompletedTopics();
    if (!list.includes(topicId)) {
      const updated = [...list, topicId];
      localStorage.setItem(COMPLETED_TOPICS_KEY, JSON.stringify(updated));
    }
  } catch {
    // ignore
  }
}

export function isTopicCompleted(topicId) {
  const list = getCompletedTopics();
  return list.includes(topicId);
}

