import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "./components/Navbar";
import BottomNavigation from "./components/BottomNavigation";
import Footer from "./components/Footer";
import StageSelectorModal from "./components/StageSelectorModal";
import LanguageSelectorModal from "./components/LanguageSelectorModal";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Lesson from "./pages/Lesson";
import Practice from "./pages/Practice";
import Projects from "./pages/Projects";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { getStoredStage, saveStage } from "./data/learningStages";
import { getStoredLanguage, saveLanguage } from "./data/learningLanguages";
import { DictionaryProvider } from "./context/DictionaryContext";
import { NotepadProvider } from "./context/NotepadContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthModal from "./components/Auth/AuthModal";
import GlobalWordMeaningModal from "./components/WordMeaning/GlobalWordMeaningModal";
import FloatingDictionaryButton from "./components/FloatingDictionaryButton";
import FloatingNotepad from "./components/Notepad/FloatingNotepad";
import FloatingNotepadButton from "./components/FloatingNotepadButton";
import { GuideTutorialProvider } from "./context/GuideTutorialContext";
import GuideTutorialModal from "./components/GuideTutorial/GuideTutorialModal";
import GuideWelcomeModal from "./components/GuideTutorial/GuideWelcomeModal";
import GuideExplorerModal from "./components/GuideTutorial/GuideExplorerModal";
import GuideCompletionModal from "./components/GuideTutorial/GuideCompletionModal";
import ContextualPageGuidance from "./components/GuideTutorial/ContextualPageGuidance";
import ErrorBoundary from "./components/ErrorBoundary";
import { RefreshCw } from "lucide-react";

// Route resolution helpers for URL hash & history synchronization
function getRouteFromLocation() {
  const hash = typeof window !== "undefined" ? window.location.hash || "" : "";
  if (!hash || hash === "#" || hash === "#/" || hash === "#/home") {
    return { page: "home", topicId: "what-is-python" };
  }
  if (hash.startsWith("#/lesson")) {
    const cleanHash = hash.replace(/^#\/?/, "");
    const parts = cleanHash.split("?")[0].split("/");
    const topicFromPath = parts[1];
    const params = new URLSearchParams(hash.includes("?") ? hash.split("?")[1] : "");
    const topicId = topicFromPath || params.get("topic") || "what-is-python";
    return { page: "lesson", topicId };
  }
  if (hash.startsWith("#/learn")) return { page: "learn", topicId: "what-is-python" };
  if (hash.startsWith("#/practice")) return { page: "practice", topicId: "what-is-python" };
  if (hash.startsWith("#/projects")) return { page: "projects", topicId: "what-is-python" };
  if (hash.startsWith("#/about")) return { page: "about", topicId: "what-is-python" };
  if (hash.startsWith("#/signup") || hash.startsWith("#/register")) {
    return { page: "signup", topicId: "what-is-python" };
  }
  if (hash.startsWith("#/signin") || hash.startsWith("#/login") || hash.startsWith("#/auth")) {
    return { page: "signin", topicId: "what-is-python" };
  }
  return { page: "home", topicId: "what-is-python" };
}

function getHashForRoute(page, topicId) {
  if (page === "home") return "#/home";
  if (page === "lesson") return `#/lesson/${topicId || "what-is-python"}`;
  if (page === "learn") return "#/learn";
  if (page === "practice") return "#/practice";
  if (page === "projects") return "#/projects";
  if (page === "about") return "#/about";
  if (page === "signup" || page === "register") return "#/signup";
  if (page === "signin" || page === "login" || page === "auth") return "#/signin";
  return "#/home";
}

function MainAppShell({
  selectedStage,
  handleSelectStage,
  selectedLanguage,
  handleSelectLanguage,
  stageModalOpen,
  setStageModalOpen,
  languageModalOpen,
  setLanguageModalOpen
}) {
  const { currentUser, updateProfile, isAuthenticated, isLoadingSession, openAuthModal } = useAuth();
  
  const handleStageChange = React.useCallback((stageId) => {
    handleSelectStage(stageId);
    if (currentUser && currentUser.stage !== stageId) {
      updateProfile({ stage: stageId }).catch(() => {});
    }
  }, [handleSelectStage, currentUser, updateProfile]);

  const handleLanguageChange = React.useCallback((langId) => {
    handleSelectLanguage(langId);
    if (currentUser && currentUser.language !== langId) {
      updateProfile({ language: langId }).catch(() => {});
    }
  }, [handleSelectLanguage, currentUser, updateProfile]);

  // Initialize route from current URL hash
  const initialRoute = React.useRef(getRouteFromLocation()).current;
  const [currentPage, setCurrentPage] = useState(initialRoute.page);
  const [selectedTopicId, setSelectedTopicId] = useState(initialRoute.topicId);
  
  // In-session navigation stack to track previous pages
  const navHistoryRef = useRef([{ page: initialRoute.page, topicId: initialRoute.topicId }]);
  const [historyDepth, setHistoryDepth] = useState(1);

  // Initialize or synchronize browser history entry on initial mount
  useEffect(() => {
    const targetHash = getHashForRoute(initialRoute.page, initialRoute.topicId);
    const stateObj = { page: initialRoute.page, topicId: initialRoute.topicId };
    if (!window.history.state || window.location.hash !== targetHash) {
      window.history.replaceState(stateObj, "", targetHash);
    }
  }, []);

  // If user becomes authenticated while on signin or signup, redirect them to home
  useEffect(() => {
    if (isAuthenticated && (currentPage === "signin" || currentPage === "signup")) {
      navigateTo("home", undefined, true);
    }
  }, [isAuthenticated, currentPage]);

  // If unauthenticated user tries to directly hash navigate to practice or projects
  useEffect(() => {
    if (!isLoadingSession && !isAuthenticated && (currentPage === "practice" || currentPage === "projects")) {
      openAuthModal(
        "login",
        `Sign in required to access ${currentPage === "practice" ? "Interactive Practice" : "Projects"}. Please sign in to continue!`
      );
      navigateTo("signin", undefined, true);
    }
  }, [isLoadingSession, isAuthenticated, currentPage]);

  // Listen to popstate, hashchange, and custom navigation events
  useEffect(() => {
    const handleRouteSync = (event) => {
      // If modal was open, close modal first and stay on current page
      if (stageModalOpen) {
        setStageModalOpen(false);
      }
      if (languageModalOpen) {
        setLanguageModalOpen(false);
      }

      // Read route from history state or URL hash
      let route = event?.state;
      if (!route || !route.page) {
        route = getRouteFromLocation();
      }

      let targetPage = route.page;
      if (targetPage === "login" || targetPage === "auth") targetPage = "signin";
      if (targetPage === "register") targetPage = "signup";

      if (navHistoryRef.current.length > 1) {
        navHistoryRef.current.pop();
        setHistoryDepth(navHistoryRef.current.length);
      }

      setCurrentPage(targetPage);
      if (route.topicId) {
        setSelectedTopicId(route.topicId);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCustomNavigate = (e) => {
      if (e.detail?.page) {
        navigateTo(e.detail.page, e.detail.topicId, true);
      }
    };

    window.addEventListener("popstate", handleRouteSync);
    window.addEventListener("hashchange", handleRouteSync);
    window.addEventListener("py_navigate", handleCustomNavigate);

    return () => {
      window.removeEventListener("popstate", handleRouteSync);
      window.removeEventListener("hashchange", handleRouteSync);
      window.removeEventListener("py_navigate", handleCustomNavigate);
    };
  }, [stageModalOpen, languageModalOpen, setStageModalOpen, setLanguageModalOpen]);

  // Navigate to a page and record in browser history
  const navigateTo = (page, topicId = selectedTopicId, replace = false) => {
    let targetPage = page;
    if (page === "login" || page === "auth") targetPage = "signin";
    if (page === "register") targetPage = "signup";

    // Protect practice and projects if not authenticated
    if (!isAuthenticated && (targetPage === "practice" || targetPage === "projects")) {
      openAuthModal(
        "login",
        `Sign in required to access ${targetPage === "practice" ? "Interactive Practice" : "Projects"}. Please sign in to continue!`
      );
      targetPage = "signin";
    }

    const hash = getHashForRoute(targetPage, topicId);
    const stateObj = { page: targetPage, topicId };

    if (replace) {
      window.history.replaceState(stateObj, "", hash);
      if (navHistoryRef.current.length > 0) {
        navHistoryRef.current[navHistoryRef.current.length - 1] = stateObj;
      } else {
        navHistoryRef.current = [stateObj];
      }
    } else {
      const lastEntry = navHistoryRef.current[navHistoryRef.current.length - 1];
      if (!lastEntry || lastEntry.page !== targetPage || (targetPage === "lesson" && lastEntry.topicId !== topicId)) {
        window.history.pushState(stateObj, "", hash);
        navHistoryRef.current.push(stateObj);
        setHistoryDepth(navHistoryRef.current.length);
      }
    }

    setCurrentPage(targetPage);
    if (topicId) setSelectedTopicId(topicId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectTopic = (topicId) => {
    navigateTo("lesson", topicId);
  };

  const handleNavigate = (page) => {
    navigateTo(page);
  };

  // Back handler for both on-screen buttons and mobile navigation
  const handleBack = () => {
    if (stageModalOpen) {
      setStageModalOpen(false);
      return;
    }
    if (languageModalOpen) {
      setLanguageModalOpen(false);
      return;
    }

    if (navHistoryRef.current.length > 1) {
      window.history.back();
    } else {
      // Fallback hierarchy if user arrived directly or refreshed
      if (currentPage === "lesson") {
        navigateTo("learn", undefined, true);
      } else if (currentPage !== "home") {
        navigateTo("home", undefined, true);
      }
    }
  };

  const handleBackToLearn = () => {
    if (navHistoryRef.current.length > 1) {
      window.history.back();
    } else {
      navigateTo("learn", undefined, true);
    }
  };

  const canGoBack = historyDepth > 1 || currentPage !== "home";

  // While checking PostgreSQL session on startup
  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050B14] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#168BFF] to-[#0876E8] flex items-center justify-center text-white text-xl font-bold font-mono shadow-lg shadow-blue-500/25 animate-pulse border border-[#168BFF]/40">
            <span className="text-white">Py</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#91A6BF]">
            <RefreshCw size={14} className="animate-spin text-[#168BFF]" />
            <span>Connecting to Learning Engine...</span>
          </div>
        </div>
      </div>
    );
  }

  // DEDICATED SEPARATE PAGE: Sign In
  if (currentPage === "signin") {
    return (
      <SignIn
        onNavigate={navigateTo}
        onBack={handleBack}
      />
    );
  }

  // DEDICATED SEPARATE PAGE: Sign Up
  if (currentPage === "signup") {
    return (
      <SignUp
        onNavigate={navigateTo}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#050B14] text-slate-900 dark:text-white selection:bg-[#168BFF]/30 selection:text-white font-sans antialiased relative transition-colors duration-200 w-full overflow-x-hidden">
      {/* Navbar with Stage, Language, Theme, Dictionary & Auth Controls */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handleNavigate}
        onSelectTopic={handleSelectTopic}
        selectedStage={selectedStage}
        onSelectStage={handleStageChange}
        onOpenStageModal={() => setStageModalOpen(true)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleLanguageChange}
        onOpenLanguageModal={() => setLanguageModalOpen(true)}
        onBack={handleBack}
        canGoBack={canGoBack}
      />

      {/* Stage Selector Modal */}
      <StageSelectorModal
        isOpen={stageModalOpen}
        onClose={() => setStageModalOpen(false)}
        selectedStage={selectedStage}
        onSelectStage={handleStageChange}
      />

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleLanguageChange}
      />

      {/* Global Authentication Modal */}
      <AuthModal onSelectTopic={handleSelectTopic} />

      {/* Main Content Area across all pages */}
      <ErrorBoundary>
        <main className="flex-1 w-full min-w-0 flex flex-col pb-20 lg:pb-0">
        {currentPage === "home" && (
          <Home
            onNavigate={handleNavigate}
            onSelectTopic={handleSelectTopic}
            selectedStage={selectedStage}
            onSelectStage={handleStageChange}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleLanguageChange}
            onOpenStageModal={() => setStageModalOpen(true)}
            onOpenLanguageModal={() => setLanguageModalOpen(true)}
            onBack={handleBack}
            canGoBack={historyDepth > 1}
          />
        )}

        {currentPage === "learn" && (
          <Learn
            onSelectTopic={handleSelectTopic}
            selectedStage={selectedStage}
            onOpenStageModal={() => setStageModalOpen(true)}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleLanguageChange}
            onOpenLanguageModal={() => setLanguageModalOpen(true)}
            onBack={handleBack}
          />
        )}

        {currentPage === "lesson" && (
          <Lesson
            topicId={selectedTopicId}
            onSelectTopic={handleSelectTopic}
            onBackToLearn={handleBackToLearn}
            onBack={handleBack}
            selectedStage={selectedStage}
            onSelectStage={handleStageChange}
            onOpenStageModal={() => setStageModalOpen(true)}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleLanguageChange}
            onOpenLanguageModal={() => setLanguageModalOpen(true)}
          />
        )}

        {currentPage === "practice" && (
          <Practice
            selectedStage={selectedStage}
            onOpenStageModal={() => setStageModalOpen(true)}
            selectedLanguage={selectedLanguage}
            onOpenLanguageModal={() => setLanguageModalOpen(true)}
            onBack={handleBack}
          />
        )}

        {currentPage === "projects" && (
          <Projects
            selectedStage={selectedStage}
            onOpenStageModal={() => setStageModalOpen(true)}
            selectedLanguage={selectedLanguage}
            onOpenLanguageModal={() => setLanguageModalOpen(true)}
            onBack={handleBack}
          />
        )}

        {currentPage === "about" && (
          <About
            onNavigate={handleNavigate}
            onBack={handleBack}
          />
        )}
        </main>
      </ErrorBoundary>

      {/* Global Word Meaning Dictionary Modal & Floating Search Trigger */}
      <GlobalWordMeaningModal />
      <FloatingDictionaryButton />

      {/* Global Floating Notepad Widget & Floating Trigger */}
      <FloatingNotepad />
      <FloatingNotepadButton />

      {/* Global Website Guide Tutorial Modal, Welcome Modal, Explorer Modal, Completion Modal & Contextual Guidance */}
      <GuideTutorialModal />
      <GuideWelcomeModal />
      <GuideExplorerModal />
      <GuideCompletionModal />
      <ContextualPageGuidance />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation Bar (Small Screens < 1024px) */}
      <BottomNavigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  const [selectedStage, setSelectedStage] = useState(getStoredStage());
  const [selectedLanguage, setSelectedLanguage] = useState(getStoredLanguage());
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);

  const handleSelectStage = React.useCallback((stageId) => {
    setSelectedStage(stageId);
    saveStage(stageId);
  }, []);

  const handleSelectLanguage = React.useCallback((langId) => {
    setSelectedLanguage(langId);
    saveLanguage(langId);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider onSyncStage={handleSelectStage} onSyncLanguage={handleSelectLanguage}>
        <DictionaryProvider selectedLanguage={selectedLanguage} selectedStage={selectedStage}>
          <NotepadProvider>
            <GuideTutorialProvider>
              <MainAppShell
                selectedStage={selectedStage}
                handleSelectStage={handleSelectStage}
                selectedLanguage={selectedLanguage}
                handleSelectLanguage={handleSelectLanguage}
                stageModalOpen={stageModalOpen}
                setStageModalOpen={setStageModalOpen}
                languageModalOpen={languageModalOpen}
                setLanguageModalOpen={setLanguageModalOpen}
              />
            </GuideTutorialProvider>
          </NotepadProvider>
        </DictionaryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
