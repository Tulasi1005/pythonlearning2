export const LEARNING_STAGES = [
  {
    id: "kid",
    icon: "🧸",
    label: "Kid",
    ageRange: "0–6 years",
    title: "🧸 Kid (0–6 years)",
    shortDesc: "Playful stories, toys, colors, animals, and zero tech jargon.",
    tagline: "Learn Python through fun stories, toy boxes, and animal adventures!",
    color: "blue",
    badgeBg: "bg-blue-50 dark:bg-[#102541] text-blue-700 dark:text-[#8CC8FF] border-blue-200 dark:border-[#183657]",
    accentColor: "#3b82f6",
    themeClass: "stage-kid",
    exampleConcept: "Toy boxes, candy counters, traffic lights, and animal sounds",
    visualStyle: "Playful visual cards with bright colors, toy metaphors, and simple shapes."
  },
  {
    id: "young",
    icon: "🎒",
    label: "Young",
    ageRange: "7–15 years",
    title: "🎒 Young (7–15 years)",
    shortDesc: "Games, sports, Roblox/Minecraft themes, scores, and beginner code.",
    tagline: "Code like a game builder! Power up your skills with gamer scores and fun bots.",
    color: "blue",
    badgeBg: "bg-blue-50 dark:bg-[#102541] text-[#306998] dark:text-[#8CC8FF] border-blue-200 dark:border-[#183657]",
    accentColor: "#306998",
    themeClass: "stage-young",
    exampleConcept: "Player inventories, HP points, superhero battles, and game leaderboards",
    visualStyle: "Arcade and game HUD diagrams with inventory slots and scoreboards."
  },
  {
    id: "college",
    icon: "🎓",
    label: "College",
    ageRange: "16–19 years",
    title: "🎓 College (16–19 years)",
    shortDesc: "Academic rigor, logical flowcharts, data structures, and exams.",
    tagline: "Master computer science concepts, memory pointers, syntax, and algorithms.",
    color: "blue",
    badgeBg: "bg-blue-50 dark:bg-[#102541] text-blue-700 dark:text-[#8CC8FF] border-blue-200 dark:border-[#183657]",
    accentColor: "#3b82f6",
    themeClass: "stage-college",
    exampleConcept: "Memory references, student gradebooks, sorting algorithms, and lab tasks",
    visualStyle: "Clean computer science block diagrams, stack/heap models, and flowchart logic."
  },
  {
    id: "graduate",
    icon: "💼",
    label: "Graduate",
    ageRange: "20–24 years",
    title: "💼 Graduate (20–24 years)",
    shortDesc: "Real-world systems, salaries, e-commerce, databases, and APIs.",
    tagline: "Build scalable software for business applications, databases, and backend services.",
    color: "blue",
    badgeBg: "bg-blue-50 dark:bg-[#102541] text-blue-800 dark:text-[#8CC8FF] border-blue-200 dark:border-[#183657]",
    accentColor: "#168BFF",
    themeClass: "stage-graduate",
    exampleConcept: "Employee payroll, e-commerce checkouts, database CRUD, and REST APIs",
    visualStyle: "Business entity relationships, service pipelines, and transaction workflows."
  },
  {
    id: "professional",
    icon: "🚀",
    label: "Job / Professional",
    ageRange: "25+ years",
    title: "🚀 Job / Professional (25+ years)",
    shortDesc: "Production code, performance, architecture, best practices, and interview prep.",
    tagline: "Industry-standard engineering, microservices, GIL optimization, and FAANG interview prep.",
    color: "blue",
    badgeBg: "bg-blue-50 dark:bg-[#102541] text-blue-700 dark:text-[#8CC8FF] border-blue-200 dark:border-[#183657]",
    accentColor: "#38bdf8",
    themeClass: "stage-professional",
    exampleConcept: "High-throughput APIs, memory profiling, microservices, and system design",
    visualStyle: "Production cloud architecture, thread execution diagrams, and memory refcount models."
  }
];

export const DEFAULT_STAGE = "young";

export function getStageById(stageId) {
  return LEARNING_STAGES.find((s) => s.id === stageId) || LEARNING_STAGES[1]; // default young
}

export function getStoredStage() {
  if (typeof window === "undefined") return DEFAULT_STAGE;
  try {
    const saved = localStorage.getItem("learningStage");
    if (saved && LEARNING_STAGES.some((s) => s.id === saved)) {
      return saved;
    }
  } catch (e) {
    // ignore
  }
  return DEFAULT_STAGE;
}

export function saveStage(stageId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("learningStage", stageId);
  } catch (e) {
    // ignore
  }
}
