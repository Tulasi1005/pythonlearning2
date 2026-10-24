import React, { useState, useEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import { useDictionary } from '../context/DictionaryContext';

export default function GlobalWordLookupTooltip() {
  const { lookupWord } = useDictionary();
  const [position, setPosition] = useState(null);
  const [selectedWord, setSelectedWord] = useState('');
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          return;
        }

        const rawText = selection.toString().trim();
        const cleanText = rawText.replace(/^[^\w]+|[^\w]+$/g, '');

        if (cleanText && cleanText.length >= 2 && cleanText.split(/\s+/).length <= 4) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          if (rect && rect.width > 0) {
            setSelectedWord(cleanText);
            // Tooltip has fixed position, so use viewport-relative coordinates
            const spaceAbove = rect.top;
            const top = spaceAbove >= 50 ? rect.top - 44 : rect.bottom + 8;
            const left = Math.max(80, Math.min(window.innerWidth - 80, rect.left + rect.width / 2));
            setPosition({ top, left });
            return;
          }
        }
      }, 50);
    };

    const handleMouseDown = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setPosition(null);
      }
    };

    const handleScrollOrResize = () => {
      // Clear tooltip position on scroll or resize to prevent floating over unrelated content
      setPosition(null);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  if (!position || !selectedWord) return null;

  return (
    <div
      ref={tooltipRef}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
      className="fixed z-[9999] pointer-events-auto animate-in"
    >
      <button
        onClick={() => {
          lookupWord(selectedWord);
          setPosition(null);
          if (window.getSelection) {
            window.getSelection().removeAllRanges();
          }
        }}
        className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-xl shadow-blue-500/20 border border-blue-400/30 transition text-xs sm:text-sm font-bold cursor-pointer hover:scale-105"
      >
        <BookOpen size={14} className="text-[#93c5fd]" />
        <span>Define </span>
        <span className="max-w-[140px] truncate underline">"{selectedWord}"</span>
      </button>
    </div>
  );
}
