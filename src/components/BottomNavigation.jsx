import React from "react";
import { Home, BookOpen, Code2, FolderGit2, Info } from "lucide-react";

/**
 * BottomNavigation component for mobile & tablet screens (< 1024px).
 * Replaces old mobile drawer/hamburger button with a modern, thumb-friendly bottom bar.
 */
export default function BottomNavigation({ currentPage, onNavigate }) {
  const navTabs = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      isActive: currentPage === "home"
    },
    {
      id: "learn",
      label: "Learn",
      icon: BookOpen,
      isActive: currentPage === "learn" || currentPage === "lesson"
    },
    {
      id: "practice",
      label: "Practice",
      icon: Code2,
      isActive: currentPage === "practice"
    },
    {
      id: "projects",
      label: "Projects",
      icon: FolderGit2,
      isActive: currentPage === "projects"
    },
    {
      id: "about",
      label: "About",
      icon: Info,
      isActive: currentPage === "about"
    }
  ];

  return (
    <nav
      id="tour-bottom-nav"
      aria-label="Mobile Bottom Navigation"
      className="app-bottom-nav"
    >
      <div className="w-full h-full max-w-md mx-auto flex items-center justify-around px-2">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.isActive;

          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}`}
              type="button"
              onClick={() => {
                onNavigate(tab.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 group cursor-pointer border-none bg-transparent transition-all duration-200 active:scale-95 select-none ${
                isActive
                  ? "text-[#168BFF] dark:text-[#60B7FF]"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {/* Active top glowing accent indicator bar */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 rounded-b-full bg-gradient-to-r from-blue-600 via-[#168BFF] to-cyan-400 shadow-[0_2px_8px_rgba(22,139,255,0.7)] animate-in" />
              )}

              {/* Icon Container with active highlight pill */}
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-500/15 dark:bg-blue-500/20 text-[#168BFF] dark:text-[#60B7FF] scale-110 shadow-xs"
                    : "group-hover:bg-slate-100 dark:group-hover:bg-[#14233a]"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
              </div>

              {/* Tab label */}
              <span
                className={`text-[10px] sm:text-[11px] font-bold tracking-tight mt-0.5 leading-none transition-colors duration-200 ${
                  isActive
                    ? "text-[#168BFF] dark:text-[#60B7FF]"
                    : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
