/**
 * guideTutorialSteps.js
 * Comprehensive interactive guide tutorial steps covering:
 * 1. Profile & Changing Your Name (Account settings)
 * 2. What Home Tab contains (Dashboard, stats, settings)
 * 3. What Learn Tab contains (19 sections, 120 lessons, keyword search)
 * 4. What Practice Tab contains (Quizzes, challenges, output predictions)
 * 5. What Projects Tab contains (Real-world applications, source code)
 * 6. What About Tab contains (Adaptive methodology & guides)
 * 7. Theme Toggle (Light & Dark Mode)
 * 8. Study Notes (Notepad / Alt+N)
 * 9. Word Meaning (Dictionary / ⌘K)
 * Plus Adaptive Stage, Multi-Language, and Curriculum access.
 */

export const GUIDE_STORAGE_KEY = "py_guide_tutorial_completed_v1";

export const GUIDE_STEPS = [
  {
    id: "welcome-hero",
    screen: "home",
    selector: "#tour-home-hero",
    fallbackSelector: ".home-page-container",
    placement: "bottom",
    title: "Welcome to Python Adaptive! 🐍",
    description:
      "Python Adaptive helps you learn programming from scratch with lessons customized to your age and native language. Take this quick tour to discover all features, navigation tabs, and profile settings.",
    mobileDescription:
      "Welcome to Python Adaptive! Take this quick tour to learn what each navigation tab contains, how to toggle themes, use notes, and change your profile name.",
    targetLabel: "Interactive Hero"
  },
  {
    id: "nav-auth-profile",
    screen: "home",
    selector: "#tour-nav-auth",
    mobileSelector: "#tour-nav-mobile-auth",
    fallbackSelector: "#tour-home-hero",
    placement: "bottom",
    title: "Profile & Change Name 👤",
    description:
      "Sign In or Sign Up to sync your progress. To change your profile name: click this profile icon, then click 'Edit Name' (Settings ⚙️) inside the modal to update your Display Name, bio, or avatar anytime!",
    mobileDescription:
      "To change your profile name: tap this account icon in the top header, then tap 'Edit Name' (⚙️) inside the profile modal to update your Display Name and bio!",
    targetLabel: "Profile & Change Name"
  },
  {
    id: "nav-item-home",
    screen: "home",
    selector: "#tour-nav-item-home",
    mobileSelector: "#bottom-nav-home",
    fallbackSelector: "#tour-nav-dock",
    placement: "top",
    title: "Home Tab 🏠",
    description:
      "Home is your learning headquarters: view your active age stage and language settings, access featured beginner lessons, and launch your daily study routine.",
    mobileDescription:
      "Home Tab: Contains your learning dashboard, active age stage and native language preferences, quick links to featured lessons, and your daily learning stats.",
    targetLabel: "Home Tab"
  },
  {
    id: "nav-item-learn",
    screen: "home",
    selector: "#tour-nav-item-learn",
    mobileSelector: "#bottom-nav-learn",
    fallbackSelector: "#tour-nav-dock",
    placement: "top",
    title: "Learn Tab (Curriculum) 📖",
    description:
      "Learn contains the complete Python curriculum: 19 structured sections with 120 interactive lessons, topic search bar, and keywords from basics to AI.",
    mobileDescription:
      "Learn Tab: Contains the full curriculum of 19 sections and 120 lessons. Search any topic, browse categories from Python Basics to OOP, and read interactive lessons.",
    targetLabel: "Learn Tab"
  },
  {
    id: "nav-item-practice",
    screen: "home",
    selector: "#tour-nav-item-practice",
    mobileSelector: "#bottom-nav-practice",
    fallbackSelector: "#tour-nav-dock",
    placement: "top",
    title: "Practice Tab (Quizzes) 💻",
    description:
      "Practice contains interactive coding quizzes, output prediction tests, and code exercises with instant feedback to test and reinforce what you learn.",
    mobileDescription:
      "Practice Tab: Contains interactive quizzes and coding challenges. Test your understanding with instant feedback, multiple choice, and code output predictions.",
    targetLabel: "Practice Tab"
  },
  {
    id: "nav-item-projects",
    screen: "home",
    selector: "#tour-nav-item-projects",
    mobileSelector: "#bottom-nav-projects",
    fallbackSelector: "#tour-nav-dock",
    placement: "top",
    title: "Projects Tab (Real Apps) 🛠️",
    description:
      "Projects contains full hands-on Python applications: build calculators, web scrapers, data tools, and games with full source code and walkthroughs.",
    mobileDescription:
      "Projects Tab: Contains real-world Python applications with step-by-step guides and full source code to build real portfolio-ready apps.",
    targetLabel: "Projects Tab"
  },
  {
    id: "nav-item-about",
    screen: "home",
    selector: "#tour-nav-item-about",
    mobileSelector: "#bottom-nav-about",
    fallbackSelector: "#tour-nav-dock",
    placement: "top",
    title: "About Tab (Methodology) ℹ️",
    description:
      "About explains our adaptive learning methodology, age-specific pedagogy, research backing, and platform mission for accessible education.",
    mobileDescription:
      "About Tab: Explains how Python Adaptive personalizes explanations across 5 age levels, native language translations, and our educational mission.",
    targetLabel: "About Tab"
  },
  {
    id: "nav-theme-toggle",
    screen: "home",
    selector: "#tour-nav-theme",
    mobileSelector: "#tour-nav-mobile-theme",
    fallbackSelector: "#tour-home-hero",
    placement: "bottom",
    title: "Theme Toggle (Light & Dark) 🌗",
    description:
      "Switch between immersive Dark Mode and crisp Light Mode anytime with one click. Your theme choice is remembered across visits for comfortable day and night studying.",
    mobileDescription:
      "Tap the Sun/Moon icon in the top header to toggle between Dark Mode and Light Mode anytime for comfortable reading.",
    targetLabel: "Theme Toggle"
  },
  {
    id: "nav-study-notes",
    screen: "home",
    selector: "#tour-nav-notes",
    mobileSelector: "#tour-floating-notepad",
    fallbackSelector: ".floating-dock-notepad",
    placement: "bottom",
    title: "Study Notes (Notepad) 📝",
    description:
      "Open your personal Study Notepad anytime (or press Alt+N) to jot down key takeaways, save code snippets, and review revision points as you study. Your notes are saved automatically.",
    mobileDescription:
      "Tap the floating Notepad button (bottom-right) anytime to write personal study notes, code tips, and lesson reminders as you learn.",
    targetLabel: "Study Notes (Alt+N)"
  },
  {
    id: "nav-tools-dict",
    screen: "home",
    selector: "#tour-nav-dict",
    mobileSelector: "#tour-floating-tools",
    fallbackSelector: ".floating-dock-dictionary",
    placement: "bottom",
    title: "Word Meaning (Dictionary) 📖",
    description:
      "Never get confused by programming jargon! Press ⌘K or click any highlighted word in a lesson to see instant, plain-language definitions in both English and your native language.",
    mobileDescription:
      "Tap the floating Word Meaning button anytime (or tap underlined terms in lessons) to see confusing programming jargon explained in simple, plain words.",
    targetLabel: "Word Meaning (⌘K)"
  },
  {
    id: "nav-stage-selector",
    screen: "home",
    selector: "#tour-nav-stage",
    mobileSelector: "#tour-home-stage-btn",
    fallbackSelector: "#tour-nav-mobile-stage",
    placement: "bottom",
    title: "Adaptive Age Stage 🎯",
    description:
      "Change how concepts are explained across 5 age groups, from Kid to Working Professional. Real-world stories and code examples update instantly to match your level.",
    mobileDescription:
      "Tap 'Change' next to Current Learning Stage to switch between 5 age levels (Kid to Working Pro). Real-world examples adapt instantly to your level.",
    targetLabel: "Age Stage Selector"
  },
  {
    id: "nav-lang-selector",
    screen: "home",
    selector: "#tour-nav-lang",
    mobileSelector: "#tour-home-lang-btn",
    fallbackSelector: "#tour-nav-mobile-lang",
    placement: "bottom",
    title: "Multi-Language Engine 🗣️",
    description:
      "Switch explanation languages between English, English+Telugu, Telugu, and Hindi. You get friendly native explanations while standard Python syntax stays intact.",
    mobileDescription:
      "Tap 'Change' next to Explanation Language to switch between English, English+Telugu, Telugu, and Hindi while standard Python code stays intact.",
    targetLabel: "Language Switcher"
  },
  {
    id: "floating-study-tools",
    screen: "home",
    selector: "#tour-floating-tools",
    fallbackSelector: ".floating-dock-dictionary",
    placement: "left",
    title: "You're All Set! 🎉",
    description:
      "You now know what each navigation tab contains, how to toggle themes, take study notes, look up words, and update your profile name. Enjoy learning Python!",
    mobileDescription:
      "You're all set! Now you know what Home, Learn, Practice, Projects, and About contain, how to use notes, and where to change your profile name. Enjoy learning!",
    targetLabel: "Finish Guide"
  }
];
