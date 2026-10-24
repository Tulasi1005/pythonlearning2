import React, { useState, useEffect } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { getWordMeaning } from '../services/wordMeaningService';
import WordMeaningSearch from './WordMeaning/WordMeaningSearch';
import WordMeaningResult from './WordMeaning/WordMeaningResult';

export default function WordDictionary({ selectedLanguage = 'english', selectedStage = 'young' }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [currentStage, setCurrentStage] = useState(selectedStage);
  const [currentLanguage, setCurrentLanguage] = useState(selectedLanguage);

  useEffect(() => {
    setCurrentStage(selectedStage);
    setCurrentLanguage(selectedLanguage);
    if (query.trim()) {
      handleSearch(query.trim(), selectedStage, selectedLanguage);
    }
  }, [selectedStage, selectedLanguage]);

  const handleSearch = async (termToSearch, stage = currentStage, lang = currentLanguage) => {
    const term = termToSearch || query;
    if (!term || !term.trim()) return;

    setIsSearching(true);
    setError('');

    try {
      const res = await getWordMeaning(term, stage, lang, 'python');
      if (res) {
        setResult(res);
      } else {
        setResult(null);
        setError(`No definition found for "${term}". Try searching 'automation', 'variable', 'function', or 'reliable'.`);
      }
    } catch {
      setResult(null);
      setError("An error occurred while retrieving the word definition. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleStageChange = (newStage) => {
    setCurrentStage(newStage);
    if (query.trim() || result?.term) {
      handleSearch(result?.term || query, newStage, currentLanguage);
    }
  };

  const handleLanguageChange = (newLang) => {
    setCurrentLanguage(newLang);
    if (query.trim() || result?.term) {
      handleSearch(result?.term || query, currentStage, newLang);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0C1B30] border border-slate-200 dark:border-[#183657] rounded-3xl shadow-sm mb-8 overflow-hidden">
      <div className="bg-slate-50 dark:bg-[#07101F] border-b border-slate-200 dark:border-[#183657] px-5 py-3.5 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen size={16} className="text-[#168BFF]" /> Word Meaning & Learning Dictionary
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-[#91A6BF] bg-slate-100 dark:bg-[#102541] px-2.5 py-1 rounded-full border border-slate-200 dark:border-[#183657]">
          Global Learning Service
        </span>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <WordMeaningSearch
          query={query}
          onQueryChange={setQuery}
          onSearch={(term) => handleSearch(term)}
          isSearching={isSearching}
        />

        {error && (
          <div className="p-4 bg-amber-50 dark:bg-[#102541] text-amber-900 dark:text-[#8CC8FF] text-sm rounded-2xl border border-amber-200 dark:border-[#183657] font-medium">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-2">
            <WordMeaningResult
              result={result}
              currentStage={currentStage}
              currentLanguage={currentLanguage}
              onStageChange={handleStageChange}
              onLanguageChange={handleLanguageChange}
              onSearchSuggestion={(sug) => {
                setQuery(sug);
                handleSearch(sug);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

