import React, { useState, useEffect, useRef } from 'react';
import { Volume2, BookOpen, X, Sparkles, ChevronRight, Loader2, Globe } from 'lucide-react';
import { useDictionary } from '../context/DictionaryContext';
import { getWordMeaning } from '../services/wordMeaningService';
import { LEARNING_LANGUAGES } from '../data/learningLanguages';

// Common stop words to avoid accidentally popup-triggering on normal filler words
const COMMON_STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to',
  'of', 'for', 'it', 'as', 'by', 'this', 'that', 'from', 'be', 'are', 'was', 'were',
  'we', 'can', 'use', 'you', 'they', 'he', 'she', 'has', 'have', 'had', 'do', 'does'
]);

export default function GlobalWordClickListener() {
  const { openDictionary, selectedLanguage, selectedStage } = useDictionary();
  const [popupData, setPopupData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [definition, setDefinition] = useState(null);
  const [currentLang, setCurrentLang] = useState(selectedLanguage || 'english');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    setCurrentLang(selectedLanguage || 'english');
  }, [selectedLanguage]);

  // Function to detect clicked word from event
  const getWordAndRect = (e) => {
    const target = e.target;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('select') ||
      target.closest('.word-popup-container') ||
      target.closest('.no-word-click')
    ) {
      return null;
    }

    let textNode = null;
    let offset = 0;

    if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
      if (pos) {
        textNode = pos.offsetNode;
        offset = pos.offset;
      }
    } else if (document.caretRangeFromPoint) {
      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (range) {
        textNode = range.startContainer;
        offset = range.startOffset;
      }
    }

    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return null;
    const text = textNode.textContent;
    if (!text) return null;

    let start = offset;
    while (start > 0 && /[\w'-]/.test(text[start - 1])) {
      start--;
    }
    let end = offset;
    while (end < text.length && /[\w'-]/.test(text[end])) {
      end++;
    }

    const rawWord = text.slice(start, end).trim();
    const cleanWord = rawWord.replace(/^[^\w]+|[^\w]+$/g, '');

    // Ignore single letters, numbers, and basic stop words
    if (!cleanWord || cleanWord.length < 2 || /^\d+$/.test(cleanWord) || COMMON_STOP_WORDS.has(cleanWord.toLowerCase())) {
      return null;
    }

    try {
      const wordRange = document.createRange();
      wordRange.setStart(textNode, start);
      wordRange.setEnd(textNode, end);
      const rect = wordRange.getBoundingClientRect();
      if (rect && rect.width > 0) {
        return { word: cleanWord, rect };
      }
    } catch {
      return null;
    }

    return null;
  };

  const fetchMeaning = async (wordToLookup, langToUse) => {
    setLoading(true);
    try {
      const res = await getWordMeaning(wordToLookup, selectedStage || 'young', langToUse, 'general');
      setDefinition(res);
    } catch {
      setDefinition(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClick = async (e) => {
      if (popupRef.current && popupRef.current.contains(e.target)) {
        return;
      }

      const match = getWordAndRect(e);
      if (!match) {
        setPopupData(null);
        return;
      }

      const { word, rect } = match;

      const topPos = rect.top + window.scrollY - 10;
      const leftPos = rect.left + window.scrollX + rect.width / 2;

      setPopupData({
        word,
        top: topPos,
        left: leftPos,
        rect
      });

      fetchMeaning(word, currentLang);
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [selectedLanguage, selectedStage, currentLang]);

  const handleLanguageSwitch = (newLang) => {
    setCurrentLang(newLang);
    if (popupData?.word) {
      fetchMeaning(popupData.word, newLang);
    }
  };

  const handleSpeak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  if (!popupData) return null;

  const popupWidth = 330;
  let adjustedLeft = popupData.left;
  if (adjustedLeft - popupWidth / 2 < 16) {
    adjustedLeft = popupWidth / 2 + 16;
  } else if (adjustedLeft + popupWidth / 2 > window.innerWidth - 16) {
    adjustedLeft = window.innerWidth - popupWidth / 2 - 16;
  }

  const isNearTop = popupData.rect.top < 240;
  const popupStyle = isNearTop
    ? {
        top: `${popupData.rect.bottom + window.scrollY + 8}px`,
        left: `${adjustedLeft}px`,
        transform: 'translateX(-50%)'
      }
    : {
        top: `${popupData.top - 8}px`,
        left: `${adjustedLeft}px`,
        transform: 'translate(-50%, -100%)'
      };

  return (
    <div
      ref={popupRef}
      style={popupStyle}
      className="fixed z-[9999] w-[320px] sm:w-[350px] bg-white dark:bg-[#101b2d] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#23344d] overflow-hidden animate-in fade-in zoom-in-95 duration-150 word-popup-container text-slate-900 dark:text-[#f8fafc]"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-blue-100" />
          <h4 className="font-bold text-sm capitalize truncate max-w-[170px] m-0 text-white">
            {definition?.term || popupData.word}
          </h4>
          {definition?.category === 'python' ? (
            <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-[#14233a] text-blue-900 dark:text-[#93c5fd] text-[9px] font-bold rounded border border-blue-200 dark:border-[#23344d]">
              Python
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleSpeak((definition?.term || popupData.word) + '. ' + (definition?.simpleMeaning || ''))}
            className="p-1 text-blue-100 hover:text-white rounded hover:bg-white/10 transition border-none cursor-pointer bg-transparent"
            title="Pronounce"
          >
            <Volume2 size={15} className={isSpeaking ? 'text-[#38bdf8] animate-pulse' : ''} />
          </button>
          <button
            onClick={() => setPopupData(null)}
            className="p-1 text-blue-200 hover:text-white rounded hover:bg-white/10 transition border-none cursor-pointer bg-transparent"
            title="Close"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Language Quick Switcher */}
      <div className="px-3.5 pt-2.5 pb-1 flex items-center gap-1.5 bg-slate-50 dark:bg-[#0c1422] border-b border-slate-100 dark:border-[#23344d] overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-slate-400 dark:text-[#94a3b8] font-semibold flex items-center gap-1 shrink-0">
          <Globe size={11} />
          Lang:
        </span>
        {LEARNING_LANGUAGES.map((l) => {
          const isActive = currentLang === l.id;
          return (
            <button
              key={l.id}
              onClick={() => handleLanguageSwitch(l.id)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer border shrink-0 ${
                isActive
                  ? "bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white border-transparent shadow-2xs"
                  : "bg-white dark:bg-[#14233a] text-slate-600 dark:text-[#cbd5e1] border-slate-200 dark:border-[#23344d] hover:bg-slate-100 dark:hover:bg-[#101b2d]"
              }`}
            >
              <span>{l.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2.5 text-xs">
        {loading && (
          <div className="flex items-center justify-center py-5 text-slate-400 gap-2">
            <Loader2 size={16} className="animate-spin text-[#3b82f6]" />
            <span className="text-xs">Finding meaning...</span>
          </div>
        )}

        {!loading && definition && !definition.notFound && (
          <>
            <div>
              <span className="font-bold text-[10px] uppercase text-slate-400 dark:text-[#94a3b8] block mb-0.5">
                Meaning:
              </span>
              <p className="text-slate-900 dark:text-[#f8fafc] font-semibold leading-relaxed text-sm m-0">
                {definition.simpleMeaning}
              </p>
            </div>

            {definition.example && (
              <div className="p-2.5 bg-blue-50/80 dark:bg-[#14233a] rounded-xl border border-blue-200/70 dark:border-[#23344d] text-slate-800 dark:text-[#f8fafc]">
                <span className="font-bold text-[10px] uppercase text-[#2563eb] dark:text-[#60a5fa] block mb-0.5">
                  💡 Example:
                </span>
                <p className="leading-snug text-[11px] m-0 text-slate-700 dark:text-[#cbd5e1]">{definition.example}</p>
              </div>
            )}

            {definition.remember && (
              <div className="p-2.5 bg-blue-50/80 dark:bg-[#14233a] rounded-xl border border-blue-200/70 dark:border-[#23344d] text-slate-800 dark:text-[#f8fafc]">
                <span className="font-bold text-[10px] uppercase text-[#2563eb] dark:text-[#60a5fa] block mb-0.5">
                  🧠 Remember:
                </span>
                <p className="leading-snug text-[11px] font-medium m-0 text-slate-700 dark:text-[#cbd5e1]">{definition.remember}</p>
              </div>
            )}

            <button
              onClick={() => {
                openDictionary(definition?.term || popupData.word);
                setPopupData(null);
              }}
              className="w-full mt-1.5 py-2 px-3 bg-blue-50 dark:bg-[#14233a] hover:bg-blue-100 dark:hover:bg-[#101b2d] text-blue-700 dark:text-[#93c5fd] font-bold rounded-xl transition flex items-center justify-center gap-1.5 text-xs border border-blue-200 dark:border-[#23344d] cursor-pointer"
            >
              <span>View Full Explanation & Code</span>
              <ChevronRight size={14} />
            </button>
          </>
        )}

        {!loading && (!definition || definition.notFound) && (
          <div className="text-slate-500 dark:text-slate-400 py-1">
            <p className="leading-snug mb-2">
              No definition cached for <span className="font-semibold text-slate-700 dark:text-slate-200">"{popupData.word}"</span>.
            </p>
            <button
              onClick={() => {
                openDictionary(popupData.word);
                setPopupData(null);
              }}
              className="btn-vibrant-primary w-full py-1.5 text-xs"
            >
              Search in Global Dictionary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
