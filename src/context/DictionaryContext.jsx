import React, { createContext, useContext, useState, useCallback } from 'react';
import { getWordMeaning, addRecentSearch } from '../services/wordMeaningService';

const DictionaryContext = createContext(null);

export function DictionaryProvider({ children, selectedLanguage = 'english', selectedStage = 'young' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const lookupWord = useCallback(async (word, lang = selectedLanguage, stage = selectedStage, context = 'general') => {
    if (!word || !word.trim()) return;
    const cleanWord = word.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
    if (!cleanWord) return;

    setQuery(cleanWord);
    setIsOpen(true);
    setIsMinimized(false);
    setIsSearching(true);
    setError('');

    try {
      const res = await getWordMeaning(cleanWord, stage, lang, context);
      if (res) {
        setResult(res);
        addRecentSearch(cleanWord);
      } else {
        setResult(null);
        setError(`No definition found for "${cleanWord}". Try searching terms like 'automation', 'reliable', 'variable', 'function', or 'algorithm'.`);
      }
    } catch {
      setResult(null);
      setError("An error occurred while fetching the word definition. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }, [selectedLanguage, selectedStage]);

  const openDictionary = useCallback((initialWord = '') => {
    setIsOpen(true);
    setIsMinimized(false);
    if (initialWord) {
      lookupWord(initialWord);
    }
  }, [lookupWord]);

  const closeDictionary = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const toggleDictionary = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setIsMinimized(false);
      return !prev;
    });
  }, []);

  const minimizeDictionary = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const restoreDictionary = useCallback(() => {
    setIsMinimized(false);
    setIsOpen(true);
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Global Keyboard shortcut: Cmd/Ctrl + K to toggle dictionary
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        toggleDictionary();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDictionary]);

  return (
    <DictionaryContext.Provider
      value={{
        isOpen,
        isMinimized,
        isExpanded,
        openDictionary,
        closeDictionary,
        toggleDictionary,
        minimizeDictionary,
        restoreDictionary,
        toggleExpanded,
        query,
        setQuery,
        result,
        setResult,
        isSearching,
        error,
        setError,
        lookupWord,
        selectedLanguage,
        selectedStage
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
}
