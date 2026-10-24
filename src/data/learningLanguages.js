export const LEARNING_LANGUAGES = [
  {
    id: "english",
    icon: "🇬🇧",
    flag: "🇬🇧",
    label: "Professional English",
    shortLabel: "English",
    description: "Simple, clear English suitable for formal learning without jargon.",
    tagline: "Clear, simple English without confusing technical jargon.",
    badgeBg: "bg-blue-50 dark:bg-[#102541] text-blue-700 dark:text-[#8CC8FF] border-blue-200 dark:border-[#183657]"
  },
  {
    id: "english-telugu",
    icon: "😊",
    flag: "😊",
    label: "English + Telugu",
    shortLabel: "Eng + Telugu",
    description: "Friend-to-friend conversational style in natural English & Telugu mix.",
    tagline: "Just like a friend explaining Python to you over tea!",
    badgeBg: "bg-blue-50 dark:bg-[#102541] text-blue-700 dark:text-[#8CC8FF] border-blue-200 dark:border-[#183657]"
  },
  {
    id: "telugu",
    icon: "🇮🇳",
    flag: "🇮🇳",
    label: "Telugu",
    shortLabel: "తెలుగు",
    description: "Completely in simple Telugu with Python code terms in English.",
    tagline: "సులువైన మరియు స్పష్టమైన తెలుగులో పైథాన్ నేర్చుకోండి.",
    badgeBg: "bg-blue-50 dark:bg-[#102541] text-blue-700 dark:text-[#8CC8FF] border-blue-200 dark:border-[#183657]"
  },
  {
    id: "hindi",
    icon: "🇮🇳",
    flag: "🇮🇳",
    label: "Hindi",
    shortLabel: "हिंदी",
    description: "Completely in simple Hindi with Python code terms in English.",
    tagline: "आसान और स्पष्ट हिंदी में पायथन सीखें।",
    badgeBg: "bg-blue-50 dark:bg-[#102541] text-blue-700 dark:text-[#8CC8FF] border-blue-200 dark:border-[#183657]"
  }
];

export const DEFAULT_LANGUAGE = "english";

export function getLanguageById(langId) {
  return LEARNING_LANGUAGES.find((l) => l.id === langId) || LEARNING_LANGUAGES[0];
}

export function getStoredLanguage() {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const saved = localStorage.getItem("learningLanguage");
    if (saved && LEARNING_LANGUAGES.some((l) => l.id === saved)) {
      return saved;
    }
  } catch (e) {
    // ignore
  }
  return DEFAULT_LANGUAGE;
}

export function saveLanguage(langId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("learningLanguage", langId);
  } catch (e) {
    // ignore
  }
}
