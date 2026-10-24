import React, { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  Code,
  Terminal,
  FolderGit2,
  Info,
  ChevronDown,
  Sun,
  Moon,
  User,
  LogIn,
  Sparkles,
  Bookmark,
  CheckCircle,
  LogOut,
  Flame,
  Settings,
  ArrowLeft,
  Check,
  Globe,
  ChevronRight,
  StickyNote,
  Compass
} from "lucide-react";
import { LEARNING_STAGES, getStageById } from "../data/learningStages";
import { LEARNING_LANGUAGES, getLanguageById } from "../data/learningLanguages";
import { useDictionary } from "../context/DictionaryContext";
import { useNotepad } from "../context/NotepadContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useGuideTutorial } from "../context/GuideTutorialContext";
import { AVATAR_OPTIONS } from "../services/authService";

export default function Navbar({
  currentPage,
  setCurrentPage,
  onSelectTopic,
  selectedStage,
  onSelectStage,
  onOpenStageModal,
  selectedLanguage = "english",
  onSelectLanguage,
  onOpenLanguageModal,
  onBack,
  canGoBack
}) {
  const { openDictionary } = useDictionary();
  const { toggleNotepad } = useNotepad();
  const { theme, toggleTheme, isDark } = useTheme();
  const { currentUser, isAuthenticated, openAuthModal, logout } = useAuth();
  const { startTour, openWelcomeModal, openExplorer } = useGuideTutorial();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [stageDropdownOpen, setStageDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const userMenuRef = useRef(null);
  const stageMenuRef = useRef(null);
  const langMenuRef = useRef(null);

  const stageMeta = getStageById(selectedStage);
  const langMeta = getLanguageById(selectedLanguage);
  const stageShortLabel = stageMeta.id === "professional" ? "Job" : stageMeta.label;
  const langShortLabel = langMeta.id === "english-telugu" ? "Telugu" : langMeta.shortLabel;

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Terminal,
      desc: "Home: Learning headquarters, stage/language settings & featured lessons"
    },
    {
      id: "learn",
      label: "Learn",
      icon: BookOpen,
      desc: "Learn: 19 curriculum sections with 120 interactive topics & keyword search"
    },
    {
      id: "practice",
      label: "Practice",
      icon: Code,
      desc: "Practice: Interactive quizzes, output predictions & coding challenges"
    },
    {
      id: "projects",
      label: "Projects",
      icon: FolderGit2,
      desc: "Projects: Real-world Python applications with full source code"
    },
    {
      id: "about",
      label: "About",
      icon: Info,
      desc: "About: Learning philosophy and age-adaptive education guides"
    },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setUserDropdownOpen(false);
    setStageDropdownOpen(false);
    setLangDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (stageMenuRef.current && !stageMenuRef.current.contains(e.target)) {
        setStageDropdownOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userAvatarMeta = AVATAR_OPTIONS.find(
    (a) => a.id === currentUser?.avatar
  ) || AVATAR_OPTIONS[0];

  return (
    <header className="app-header">
      <div className="app-navbar-container">
        {/* Left: Back Button & Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
          {currentPage !== "home" && onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/[0.08] hover:bg-slate-200/70 dark:hover:bg-slate-700/80 cursor-pointer shadow-2xs transition shrink-0 active:scale-95 group"
              title="Go to previous page"
              aria-label="Go back"
            >
              <ArrowLeft size={15} className="text-[#168BFF] dark:text-[#60B7FF] group-hover:-translate-x-0.5 transition-transform shrink-0" />
              <span className="hidden xxl:inline">Back</span>
            </button>
          )}

          <button
            id="tour-nav-brand"
            onClick={() => handleNavClick("home")}
            className="navbar-brand-btn"
          >
            <div className="navbar-brand-icon">
              <span className="font-extrabold text-sm font-mono text-cyan-200 tracking-tight">Py</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="navbar-brand-title truncate">
                Python Adaptive
              </span>
              <span className="hidden xxl:inline-flex navbar-brand-badge">
                Adaptive
              </span>
            </div>
          </button>
        </div>

        {/* Center: Segmented Navigation Dock (Desktop >= 1024px) */}
        <div className="navbar-desktop-menu items-center justify-center shrink-0">
          <nav id="tour-nav-dock" className="navbar-nav-dock">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPage === item.id ||
                (item.id === "learn" && currentPage === "lesson");
              return (
                <button
                  key={item.id}
                  id={`tour-nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`navbar-nav-item ${isActive ? "active" : ""}`}
                  title={item.desc}
                >
                  {isActive && <span className="navbar-nav-active-dot" />}
                  <Icon size={14} className={isActive ? "text-[#168BFF]" : "text-[#91A6BF]"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Controls & Preferences (Desktop >= 1024px) */}
        <div className="navbar-desktop-menu items-center gap-1.5 xl:gap-2 shrink-0">
          {/* 1. Context Capsule (Stage + Language Switcher) */}
          <div id="tour-nav-capsule" className="navbar-context-capsule">
            {/* Learning Stage Dropdown Trigger */}
            <div className="relative shrink-0" ref={stageMenuRef}>
              <button
                id="tour-nav-stage"
                onClick={() => {
                  setStageDropdownOpen(!stageDropdownOpen);
                  setLangDropdownOpen(false);
                  setUserDropdownOpen(false);
                }}
                className={`navbar-capsule-btn ${stageDropdownOpen ? "open-stage" : ""}`}
                title={`Learning Stage: ${stageMeta.label}`}
                aria-expanded={stageDropdownOpen}
                aria-haspopup="true"
              >
                <span className="text-sm select-none shrink-0">{stageMeta.icon}</span>
                <span className="navbar-capsule-text truncate max-w-[50px] xl:max-w-[70px] xxl:max-w-[125px]">
                  {stageShortLabel}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-slate-400 transition-transform shrink-0 ${
                    stageDropdownOpen ? "rotate-180 text-[#3b82f6]" : ""
                  }`}
                />
              </button>

              {/* Stage Quick Switch Dropdown */}
              {stageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#101b2d] border border-slate-200 dark:border-[#23344d] shadow-2xl p-2 z-50 animate-in">
                  <div className="px-2.5 py-1.5 mb-1.5 border-b border-slate-100 dark:border-[#23344d] flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Learning Stage (Age)
                    </span>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-[#60a5fa]">
                      {stageMeta.label}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {LEARNING_STAGES.map((stg) => {
                      const isSelected = selectedStage === stg.id;
                      return (
                        <button
                          key={stg.id}
                          onClick={() => {
                            if (onSelectStage) onSelectStage(stg.id);
                            setStageDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer border ${
                            isSelected
                              ? "bg-blue-50 dark:bg-[#14233a] border-blue-200 dark:border-[#3b82f6] text-blue-950 dark:text-[#f8fafc] font-bold"
                              : "bg-transparent hover:bg-slate-100 dark:hover:bg-[#14233a] border-transparent text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl shrink-0 select-none">{stg.icon}</span>
                            <div className="min-w-0">
                              <div className="text-xs font-bold leading-tight truncate">
                                {stg.label}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">
                                {stg.ageRange} • {stg.shortDesc.slice(0, 30)}...
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shrink-0 ml-1.5">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-[#23344d]">
                    <button
                      onClick={() => {
                        setStageDropdownOpen(false);
                        if (onOpenStageModal) onOpenStageModal();
                      }}
                      className="w-full py-1.5 px-2 text-[11px] font-bold text-center text-blue-600 dark:text-[#60a5fa] hover:underline cursor-pointer bg-transparent border-none"
                    >
                      View All Stage Details & Cards →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="navbar-capsule-divider" />

            {/* Language Dropdown Trigger */}
            <div className="relative shrink-0" ref={langMenuRef}>
              <button
                id="tour-nav-lang"
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setStageDropdownOpen(false);
                  setUserDropdownOpen(false);
                }}
                className={`navbar-capsule-btn ${langDropdownOpen ? "open-lang" : ""}`}
                title={`Language: ${langMeta.label}`}
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
              >
                <span className="text-sm select-none shrink-0">{langMeta.icon}</span>
                <span className="navbar-capsule-text truncate max-w-[50px] xl:max-w-[65px] xxl:max-w-[110px]">
                  {langShortLabel}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-slate-400 transition-transform shrink-0 ${
                    langDropdownOpen ? "rotate-180 text-[#38bdf8]" : ""
                  }`}
                />
              </button>

              {/* Language Quick Switch Dropdown */}
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#101b2d] border border-slate-200 dark:border-[#23344d] shadow-2xl p-2 z-50 animate-in">
                  <div className="px-2.5 py-1.5 mb-1.5 border-b border-slate-100 dark:border-[#23344d] flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <Globe size={13} className="text-[#38bdf8]" />
                      <span>Learning Language</span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-[#38bdf8]">
                      {langMeta.shortLabel}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {LEARNING_LANGUAGES.map((lang) => {
                      const isSelected = selectedLanguage === lang.id;
                      return (
                        <button
                          key={lang.id}
                          onClick={() => {
                            if (onSelectLanguage) onSelectLanguage(lang.id);
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer border ${
                            isSelected
                              ? "bg-blue-50 dark:bg-[#14233a] border-blue-200 dark:border-[#3b82f6] text-blue-950 dark:text-[#f8fafc] font-bold"
                              : "bg-transparent hover:bg-slate-100 dark:hover:bg-[#14233a] border-transparent text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl shrink-0 select-none">{lang.icon}</span>
                            <div className="min-w-0">
                              <div className="text-xs font-bold leading-tight truncate">
                                {lang.label}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">
                                {lang.shortLabel} • {lang.description.slice(0, 36)}...
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shrink-0 ml-1.5">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-[#23344d]">
                    <button
                      onClick={() => {
                        setLangDropdownOpen(false);
                        if (onOpenLanguageModal) onOpenLanguageModal();
                      }}
                      className="w-full py-1.5 px-2 text-[11px] font-bold text-center text-blue-600 dark:text-[#60a5fa] hover:underline cursor-pointer bg-transparent border-none"
                    >
                      View Full Multi-Language Guide →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Quick Tools: Meaning, Notes, and Explore App */}
          <div id="tour-nav-tools" className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Meaning Dictionary */}
            <button
              id="tour-nav-dict"
              onClick={() => openDictionary()}
              className="navbar-tool-btn navbar-tool-btn-compact hidden xl:inline-flex"
              title="Open Global Word Meaning Dictionary (⌘K)"
              aria-label="Word Meaning Dictionary"
            >
              <BookOpen size={14} className="text-blue-500 dark:text-[#60a5fa] shrink-0" />
              <span className="hidden xxl:inline">Meaning</span>
              <kbd className="navbar-tool-kbd hidden xxl:inline">⌘K</kbd>
            </button>

            {/* Study Notepad */}
            <button
              id="tour-nav-notes"
              onClick={() => toggleNotepad()}
              className="navbar-tool-btn navbar-tool-btn-compact hidden xl:inline-flex"
              title="Open Study Notepad to write important points (Alt+N)"
              aria-label="Study Notepad"
            >
              <StickyNote size={14} className="text-blue-500 dark:text-[#38bdf8] shrink-0" />
              <span className="hidden xxl:inline">Notes</span>
            </button>

            {/* Explore App Feature */}
            <button
              id="tour-btn-explore-app"
              onClick={() => openExplorer("all")}
              className="navbar-tool-btn navbar-btn-explore group relative"
              title="Explore App: Search all pages, features & take interactive tour"
              aria-label="Explore App"
            >
              <Compass size={14} className="text-[#168BFF] dark:text-[#38bdf8] shrink-0 group-hover:rotate-45 transition-transform" />
              <span className="font-extrabold text-blue-600 dark:text-[#60B7FF] navbar-btn-explore-label">
                <span className="navbar-btn-explore-text-short">Explore</span>
                <span className="navbar-btn-explore-text-full">Explore App</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            </button>
          </div>

          {/* 3. Theme Toggle */}
          <button
            id="tour-nav-theme"
            onClick={toggleTheme}
            className="navbar-icon-btn"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={15} className="text-[#60a5fa]" /> : <Moon size={15} className="text-slate-600" />}
          </button>

          {/* 4. User Profile or Auth Buttons */}
          <div id="tour-nav-auth" className="relative shrink-0" ref={userMenuRef}>
            {isAuthenticated && currentUser ? (
              <>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="navbar-user-btn shrink-0"
                  title="Your Learning Profile & Settings"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="navbar-user-avatar">
                    {userAvatarMeta.emoji}
                  </div>
                  <span className="navbar-user-name truncate max-w-[65px] lg:max-w-[85px] xxl:max-w-[120px]">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <div className="navbar-user-xp hidden sm:flex">
                    <Sparkles size={9} className="text-cyan-500 shrink-0" />
                    <span>{currentUser.stats?.xp || 0}</span>
                  </div>
                  <ChevronDown
                    size={12}
                    className={`text-slate-400 transition-transform ${
                      userDropdownOpen ? "rotate-180 text-[#168BFF]" : ""
                    }`}
                  />
                </button>

                {/* Ultra-Premium Redesigned Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="user-menu-popover">
                    {/* User Profile Header Card */}
                    <div className="user-menu-card-header">
                      <div className="flex items-center gap-3 relative z-10">
                        {/* Avatar */}
                        <div className="user-menu-avatar-badge">
                          {userAvatarMeta.emoji}
                        </div>

                        {/* Name & Email */}
                        <div className="min-w-0 flex-1">
                          <h4 className="user-menu-name">
                            {currentUser.name}
                          </h4>
                          <p className="user-menu-email">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>

                      {/* User Badges: Stage & XP */}
                      <div className="user-menu-badges-row">
                        <div className="user-badge-stage">
                          <span>{stageMeta.icon}</span>
                          <span className="truncate max-w-[120px]">{stageMeta.label}</span>
                        </div>

                        <div className="user-badge-xp">
                          <Sparkles size={11} className="text-[#38bdf8] shrink-0" />
                          <span>{currentUser.stats?.xp || 0} XP</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Summary Cards */}
                    <div className="user-menu-stats-grid">
                      <div className="user-menu-stat-tile">
                        <div className="user-menu-stat-icon-blue">
                          <CheckCircle size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="user-menu-stat-val">
                            {(currentUser.stats?.completedTopics || []).length}
                          </div>
                          <div className="user-menu-stat-lbl">
                            Lessons Done
                          </div>
                        </div>
                      </div>

                      <div className="user-menu-stat-tile">
                        <div className="user-menu-stat-icon-blue">
                          <Bookmark size={15} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="user-menu-stat-val">
                            {(currentUser.stats?.bookmarkedTopics || []).length}
                          </div>
                          <div className="user-menu-stat-lbl">
                            Bookmarks
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openAuthModal("profile");
                        }}
                        className="user-menu-action"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="user-menu-action-icon-blue">
                            <User size={15} />
                          </div>
                          <div className="min-w-0">
                            <div className="user-menu-action-title">My Profile & Stats</div>
                            <div className="user-menu-action-sub">Avatar, stats & achievements</div>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 shrink-0 ml-1" />
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenStageModal();
                        }}
                        className="user-menu-action"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="user-menu-action-icon-blue">
                            <Settings size={15} />
                          </div>
                          <div className="min-w-0">
                            <div className="user-menu-action-title">Learning Stage</div>
                            <div className="user-menu-action-sub">Current: {stageMeta.label}</div>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 shrink-0 ml-1" />
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openExplorer("all");
                        }}
                        className="user-menu-action"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="user-menu-action-icon-blue">
                            <Compass size={15} />
                          </div>
                          <div className="min-w-0">
                            <div className="user-menu-action-title">Explore App</div>
                            <div className="user-menu-action-sub">Search pages, features & guided tour</div>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 shrink-0 ml-1" />
                      </button>

                      <div className="my-1.5 border-t border-slate-100 dark:border-slate-800"></div>

                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await logout();
                          setCurrentPage("signin");
                        }}
                        className="user-menu-signout"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="user-menu-signout-icon">
                            <LogOut size={14} />
                          </div>
                          <span className="font-bold text-xs">Sign Out</span>
                        </div>
                        <ChevronRight size={14} className="shrink-0 ml-1 opacity-70" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => setCurrentPage("signin")}
                  className="navbar-auth-btn-signin flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#60a5fa] hover:bg-slate-100 dark:hover:bg-[#14233a] transition cursor-pointer border-none shrink-0"
                >
                  <LogIn size={14} className="shrink-0" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => setCurrentPage("signup")}
                  className="navbar-auth-btn-signup flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white shadow-xs shadow-blue-500/20 transition cursor-pointer border-none shrink-0"
                >
                  <Sparkles size={13} className="shrink-0" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile / Compact Controls (<1024px, optimized for 280px-1023px) */}
        <div className="navbar-mobile-menu items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Tablet Explore App shortcut (visible on tablet 640px - 1023px) */}
          <button
            onClick={() => openExplorer("all")}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-500/10 hover:bg-blue-500/20 text-[#168BFF] dark:text-[#60B7FF] border border-blue-500/20 transition cursor-pointer shrink-0"
            title="Explore App: Search pages & features"
          >
            <Compass size={14} className="shrink-0" />
            <span>Explore</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <button
            id="tour-nav-mobile-theme"
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-[#101b2d] text-slate-700 dark:text-[#60a5fa] border border-slate-200 dark:border-[#23344d] cursor-pointer shadow-2xs shrink-0"
            title="Toggle theme"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* User Profile Avatar / Login Icon on Mobile */}
          {isAuthenticated && currentUser ? (
            <button
              id="tour-nav-mobile-auth"
              onClick={() => openAuthModal("profile")}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-[#101b2d] text-blue-600 dark:text-[#93c5fd] border border-blue-200 dark:border-[#23344d] cursor-pointer shadow-2xs text-base shrink-0"
              title="Profile & Stats"
            >
              {userAvatarMeta.emoji}
            </button>
          ) : (
            <button
              id="tour-nav-mobile-auth"
              onClick={() => setCurrentPage("signin")}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-[#101b2d] text-blue-600 dark:text-[#93c5fd] border border-blue-200 dark:border-[#23344d] cursor-pointer shadow-2xs shrink-0"
              title="Sign In"
            >
              <LogIn size={15} />
            </button>
          )}

          {/* Language switch quick pill */}
          <button
            id="tour-nav-mobile-lang"
            onClick={onOpenLanguageModal}
            className="h-8 sm:h-9 px-1.5 sm:px-2.5 hidden xs:flex items-center gap-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#101b2d] border border-slate-200 dark:border-[#23344d] text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs shrink-0"
            title="Switch Language"
          >
            <span className="text-sm">{langMeta.icon}</span>
            <span className="hidden sm:inline">{langShortLabel}</span>
          </button>

          {/* Stage switch quick pill */}
          <button
            id="tour-nav-mobile-stage"
            onClick={onOpenStageModal}
            className="h-8 sm:h-9 px-1.5 sm:px-2.5 hidden xs:flex items-center gap-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#101b2d] border border-slate-200 dark:border-[#23344d] text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs shrink-0"
            title="Switch Learning Stage"
          >
            <span className="text-sm">{stageMeta.icon}</span>
            <span className="hidden sm:inline">{stageMeta.label}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
