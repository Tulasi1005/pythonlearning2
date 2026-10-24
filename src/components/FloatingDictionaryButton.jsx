import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import { useDictionary } from '../context/DictionaryContext';
import { useNotepad } from '../context/NotepadContext';

export default function FloatingDictionaryButton() {
  const { openDictionary, isOpen, isMinimized } = useDictionary();

  // Hide button when floating dictionary is already open and not minimized
  if (isOpen && !isMinimized) return null;

  return (
    <div id="tour-floating-tools" className="floating-dock-dictionary animate-in">
      <button
        onClick={() => openDictionary()}
        className="flex items-center gap-2 sm:gap-2.5 p-2 sm:px-4 sm:py-2.5 bg-white/95 dark:bg-[#101b2d]/95 hover:bg-slate-50 dark:hover:bg-[#14233a] text-slate-900 dark:text-white rounded-2xl shadow-lg hover:shadow-xl border border-slate-200 dark:border-[#23344d] hover:border-[#3b82f6] transition-all transform hover:-translate-y-0.5 cursor-pointer group backdrop-blur-md"
        title="Open Word Meaning Dictionary (⌘K)"
      >
        <div className="w-7 h-7 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white flex items-center justify-center shadow-xs shrink-0">
          <BookOpen size={16} />
        </div>
        <span className="font-bold text-xs sm:text-sm hidden sm:inline">Word Meaning</span>
        <span className="text-xs text-[#3b82f6] dark:text-[#60a5fa] font-mono font-bold border border-blue-200 dark:border-[#23344d] px-1.5 py-0.5 rounded-lg bg-blue-50 dark:bg-[#14233a] hidden sm:inline">
          ⌘K
        </span>
      </button>
    </div>
  );
}
