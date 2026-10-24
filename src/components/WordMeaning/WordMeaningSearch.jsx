import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, History, Sparkles } from 'lucide-react';
import { getRecentSearches } from '../../services/wordMeaningService';

const QUICK_DISCOVERY_WORDS = [
  'Automation',
  'Variable',
  'Function',
  'Reliable',
  'Reusable',
  'Syntax',
  'Algorithm',
  'Database',
  'Application',
  'Parameter'
];

export default function WordMeaningSearch({
  query,
  onQueryChange,
  onSearch,
  isSearching,
  autoFocus = false
}) {
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setRecentSearches(getRecentSearches());
    }
  };

  const handleChipClick = (term) => {
    onQueryChange(term);
    onSearch(term);
    setRecentSearches(getRecentSearches());
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
        <div className="word-meaning-input-wrapper">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#168BFF]">
            <Search size={17} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search word (e.g. automation, variable, loop)..."
            className="word-meaning-input"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 dark:hover:text-white border-none bg-transparent cursor-pointer"
              title="Clear input"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="btn-vibrant-primary shrink-0 py-2.5 px-4 sm:px-5 text-xs sm:text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isSearching ? <Loader2 size={15} className="animate-spin" /> : null}
          <span>{isSearching ? 'Searching...' : 'Search'}</span>
        </button>
      </form>

      {/* Quick Discovery Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#168BFF] uppercase tracking-wider">
          <Sparkles size={13} className="text-[#168BFF]" />
          <span>Suggestions</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {QUICK_DISCOVERY_WORDS.map((term) => {
            const isMatch = query.toLowerCase().trim() === term.toLowerCase();
            return (
              <button
                key={term}
                type="button"
                onClick={() => handleChipClick(term)}
                className={`word-meaning-chip ${isMatch ? 'active' : ''}`}
              >
                {term}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-[#91A6BF] uppercase tracking-wider">
            <History size={13} />
            <span>Recent</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleChipClick(term)}
                className="word-meaning-chip text-slate-600 dark:text-[#D2DEEC]"
              >
                • {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
