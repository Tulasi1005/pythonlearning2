import React from "react";
import { Terminal, Heart } from "lucide-react";

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-white/90 dark:bg-[#0a101c]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#23344d] mt-auto w-full transition-colors relative z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold font-mono text-sm shadow-sm border border-blue-400/20 shrink-0">
              <span className="text-white font-extrabold">Py</span>
            </div>
            <div className="min-w-0">
              <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg block">
                Python Adaptive Guide
              </span>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#94a3b8] m-0 max-w-sm sm:max-w-none">
                Interactive, distraction-free Python education for all ages.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-[#cbd5e1]">
            <button
              onClick={() => { onNavigate("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="hover:text-blue-600 dark:hover:text-[#60a5fa] bg-transparent border-none cursor-pointer p-0 transition"
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate("learn"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="hover:text-blue-600 dark:hover:text-[#60a5fa] bg-transparent border-none cursor-pointer p-0 transition"
            >
              Curriculum (198 Topics)
            </button>
            <button
              onClick={() => { onNavigate("practice"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="hover:text-blue-600 dark:hover:text-[#60a5fa] bg-transparent border-none cursor-pointer p-0 transition"
            >
              Practice
            </button>
            <button
              onClick={() => { onNavigate("projects"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="hover:text-blue-600 dark:hover:text-[#60a5fa] bg-transparent border-none cursor-pointer p-0 transition"
            >
              Projects
            </button>
            <button
              onClick={() => { onNavigate("about"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="hover:text-blue-600 dark:hover:text-[#60a5fa] bg-transparent border-none cursor-pointer p-0 transition"
            >
              About
            </button>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-[#23344d] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 dark:text-[#94a3b8] text-center sm:text-left">
          <p className="m-0">
            © {new Date().getFullYear()} Python Adaptive Guide. Free & Open Education.
          </p>
          <div className="flex items-center justify-center sm:justify-end gap-1.5 font-semibold text-blue-600 dark:text-[#60a5fa]">
            <span>Learn by doing • Multi-Language & Age-Adaptive</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
