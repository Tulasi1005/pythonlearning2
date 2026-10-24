import React from 'react';
import { useDictionary } from '../../context/DictionaryContext';

export default function ClickableWord({
  word,
  children,
  context = 'python',
  className = ''
}) {
  const { lookupWord } = useDictionary();
  const targetWord = word || (typeof children === 'string' ? children : '');

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (targetWord) {
      lookupWord(targetWord, undefined, undefined, context);
    }
  };

  return (
    <span
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title={`Click to see meaning of "${targetWord}"`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      }}
      className={`inline cursor-pointer border-b border-dashed border-[#3b82f6]/50 hover:border-[#3b82f6] hover:bg-blue-50/80 dark:hover:bg-[#14233a] hover:text-[#3b82f6] dark:hover:text-[#60a5fa] rounded px-0.5 transition-colors font-medium ${className}`}
    >
      {children || word}
    </span>
  );
}
