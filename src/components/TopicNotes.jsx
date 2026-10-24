import React, { useState, useEffect, useRef } from 'react';
import {
  StickyNote,
  Save,
  Check,
  Copy,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bold,
  List,
  Code2,
  CheckSquare,
  Maximize2,
  Minimize2,
  Download
} from 'lucide-react';

export default function TopicNotes({ topicId, topicTitle, defaultKeyPoints = [] }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'dirty'
  const [copied, setCopied] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const saveTimeoutRef = useRef(null);
  const textareaRef = useRef(null);

  const storageKey = `py_notes_${topicId}`;

  // Load existing notes for this topic from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        setNoteContent(saved);
        setSaveStatus('saved');
      } else {
        setNoteContent('');
        setSaveStatus('saved');
      }
    } catch {
      setNoteContent('');
    }
  }, [topicId, storageKey]);

  // Sync with cross-component note updates (e.g. FloatingNotepad) in real time
  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail?.key === storageKey && e.detail.val !== noteContent) {
        setNoteContent(e.detail.val);
        setSaveStatus('saved');
      }
    };
    window.addEventListener('py_notes_updated', handleSync);
    return () => window.removeEventListener('py_notes_updated', handleSync);
  }, [storageKey, noteContent]);

  // Auto-save note with debounce
  const handleContentChange = (e) => {
    const val = e.target.value;
    setNoteContent(val);
    setSaveStatus('saving');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, val);
        window.dispatchEvent(
          new CustomEvent('py_notes_updated', {
            detail: { key: storageKey, val }
          })
        );
        setSaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch {
        setSaveStatus('saved');
      }
    }, 500);
  };

  const syncChange = (newVal) => {
    try {
      localStorage.setItem(storageKey, newVal);
      window.dispatchEvent(
        new CustomEvent('py_notes_updated', {
          detail: { key: storageKey, val: newVal }
        })
      );
    } catch {
      // ignore
    }
  };

  const handleManualSave = () => {
    try {
      syncChange(noteContent);
      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // ignore
    }
  };

  const handleInsertTemplate = () => {
    const template = `📌 **${topicTitle} — Key Notes**:\n• Core Concept: \n• Important Syntax: \n• Real-World Use Case: \n• Watch Out For: \n`;
    const newContent = noteContent ? `${noteContent}\n\n${template}` : template;
    setNoteContent(newContent);
    syncChange(newContent);
    setSaveStatus('saved');
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleInsertKeyPoint = (point) => {
    const addition = `• ${point}\n`;
    const newContent = noteContent ? `${noteContent}\n${addition}` : addition;
    setNoteContent(newContent);
    syncChange(newContent);
    setSaveStatus('saved');
  };

  const handleInsertSnippet = (type) => {
    let snippet = '';
    if (type === 'bullet') snippet = '• ';
    if (type === 'todo') snippet = '- [ ] ';
    if (type === 'code') snippet = '```python\n# Code snippet\n\n```\n';
    if (type === 'bold') snippet = '**Important**: ';

    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart || 0;
      const end = textareaRef.current.selectionEnd || 0;
      const before = noteContent.substring(0, start);
      const after = noteContent.substring(end);
      const updated = before + snippet + after;
      setNoteContent(updated);
      syncChange(updated);
      setSaveStatus('saved');
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(start + snippet.length, start + snippet.length);
        }
      }, 50);
    } else {
      const updated = noteContent + '\n' + snippet;
      setNoteContent(updated);
      syncChange(updated);
      setSaveStatus('saved');
    }
  };

  const handleCopyNotes = async () => {
    if (!noteContent) return;
    let copiedSuccess = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(noteContent);
        copiedSuccess = true;
      }
    } catch {
      copiedSuccess = false;
    }

    if (!copiedSuccess) {
      try {
        const ta = document.createElement("textarea");
        ta.value = noteContent;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        ta.style.top = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        copiedSuccess = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        copiedSuccess = false;
      }
    }

    if (copiedSuccess) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadNotes = () => {
    if (!noteContent) return;
    try {
      const blob = new Blob([noteContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topicId}-notes.md`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Failed to download note:", err);
    }
  };

  const handleClearNotes = () => {
    if (!noteContent) return;
    if (window.confirm('Are you sure you want to clear your notes for this topic?')) {
      setNoteContent('');
      try {
        localStorage.removeItem(storageKey);
        window.dispatchEvent(
          new CustomEvent('py_notes_updated', {
            detail: { key: storageKey, val: '' }
          })
        );
      } catch {
        // ignore
      }
      setSaveStatus('saved');
    }
  };

  return (
    <div
      className={`bg-white dark:bg-[#0C1B30] rounded-2xl border border-slate-200 dark:border-[#183657] shadow-sm transition-all duration-200 overflow-hidden w-full ${
        isExpanded ? 'fixed inset-2 sm:inset-4 md:inset-6 z-[9990] max-w-4xl max-h-[96vh] mx-auto shadow-2xl flex flex-col bg-white dark:bg-[#0C1B30]' : ''
      }`}
    >
      {/* Note Header */}
      <div className="bg-slate-50 dark:bg-[#07101F] px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-[#183657]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-[#102541] border border-blue-200 dark:border-[#183657] text-[#168BFF] flex items-center justify-center shadow-2xs">
            <StickyNote size={17} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
              <span>My Important Notes</span>
              {noteContent && (
                <span className="w-2 h-2 rounded-full bg-[#168BFF] inline-block animate-pulse" title="Notes Active" />
              )}
            </h3>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-[#91A6BF] block">
              Auto-saved for "{topicTitle}"
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {saveStatus === 'saving' && (
            <span className="text-[10px] font-semibold text-blue-600 dark:text-[#8CC8FF] animate-pulse px-2 py-0.5 bg-blue-50 dark:bg-[#102541] border border-blue-200 dark:border-[#183657] rounded-md">
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && lastSavedTime && (
            <span className="hidden sm:inline-block text-[10px] text-slate-500 dark:text-[#91A6BF] mr-1">
              Saved {lastSavedTime}
            </span>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-[#91A6BF] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#102541] rounded-lg transition border-none cursor-pointer bg-transparent"
            title={isExpanded ? "Collapse Note" : "Expand Note to Full Screen"}
          >
            {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-[#91A6BF] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#102541] rounded-lg transition border-none cursor-pointer bg-transparent"
            title={isOpen ? "Minimize Notes" : "Open Notes"}
          >
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Note Body (Collapsible) */}
      {isOpen && (
        <div className={`p-3.5 space-y-3 ${isExpanded ? 'flex-1 flex flex-col' : ''}`}>
          {/* Quick Toolbar */}
          <div className="flex items-center justify-between gap-1 flex-wrap pb-2 border-b border-slate-200 dark:border-[#183657] text-xs">
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => handleInsertSnippet('bullet')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#102541] dark:hover:bg-[#183657] text-slate-700 hover:text-slate-900 dark:text-[#D2DEEC] dark:hover:text-white font-semibold rounded-md border border-slate-200 dark:border-[#183657] hover:border-[#168BFF] transition flex items-center gap-1 cursor-pointer text-[11px]"
                title="Insert Bullet Point"
              >
                <List size={12} className="text-[#168BFF]" />
                <span className="hidden sm:inline">Bullet</span>
              </button>

              <button
                onClick={() => handleInsertSnippet('bold')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#102541] dark:hover:bg-[#183657] text-slate-700 hover:text-slate-900 dark:text-[#D2DEEC] dark:hover:text-white font-semibold rounded-md border border-slate-200 dark:border-[#183657] hover:border-[#168BFF] transition flex items-center gap-1 cursor-pointer text-[11px]"
                title="Insert Important Bold Tag"
              >
                <Bold size={12} className="text-[#168BFF]" />
                <span className="hidden sm:inline">Bold</span>
              </button>

              <button
                onClick={() => handleInsertSnippet('code')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#102541] dark:hover:bg-[#183657] text-slate-700 hover:text-slate-900 dark:text-[#D2DEEC] dark:hover:text-white font-semibold rounded-md border border-slate-200 dark:border-[#183657] hover:border-[#168BFF] transition flex items-center gap-1 cursor-pointer text-[11px]"
                title="Insert Code Block"
              >
                <Code2 size={12} className="text-[#168BFF]" />
                <span className="hidden sm:inline">Code</span>
              </button>

              <button
                onClick={() => handleInsertSnippet('todo')}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#102541] dark:hover:bg-[#183657] text-slate-700 hover:text-slate-900 dark:text-[#D2DEEC] dark:hover:text-white font-semibold rounded-md border border-slate-200 dark:border-[#183657] hover:border-[#168BFF] transition flex items-center gap-1 cursor-pointer text-[11px]"
                title="Insert Checklist Item"
              >
                <CheckSquare size={12} className="text-[#168BFF]" />
                <span className="hidden sm:inline">Checklist</span>
              </button>

              <button
                onClick={handleInsertTemplate}
                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-[#102B4A] dark:hover:bg-[#168BFF]/20 text-[#168BFF] dark:text-[#8CC8FF] font-bold rounded-md border border-blue-200 dark:border-[#168BFF]/40 transition flex items-center gap-1 cursor-pointer text-[11px]"
                title="Insert Structured Note Template"
              >
                <Sparkles size={12} className="text-[#168BFF]" />
                <span className="hidden sm:inline">Template</span>
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyNotes}
                disabled={!noteContent}
                className="p-1.5 text-slate-500 hover:text-[#168BFF] dark:text-[#91A6BF] dark:hover:text-[#168BFF] rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
                title="Copy Notes to Clipboard"
              >
                {copied ? <Check size={14} className="text-[#168BFF]" /> : <Copy size={14} />}
              </button>

              <button
                onClick={handleDownloadNotes}
                disabled={!noteContent}
                className="p-1.5 text-slate-500 hover:text-[#168BFF] dark:text-[#91A6BF] dark:hover:text-[#168BFF] rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
                title="Download as Markdown"
              >
                <Download size={14} />
              </button>

              <button
                onClick={handleClearNotes}
                disabled={!noteContent}
                className="p-1.5 text-slate-500 hover:text-red-500 dark:text-[#91A6BF] dark:hover:text-white rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
                title="Clear Notes"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Text Area for User Notes */}
          <div className={`relative ${isExpanded ? 'flex-1 flex flex-col' : ''}`}>
            <textarea
              ref={textareaRef}
              rows={6}
              value={noteContent}
              onChange={handleContentChange}
              placeholder={`Write your important points, reminders, and key concepts for "${topicTitle}" here...\n\nExample:\n• Remember: print() outputs values to the terminal\n• Watch out: Variable names cannot start with a number`}
              style={{ minHeight: isExpanded ? '100%' : '140px' }}
              className={`topic-notes-textarea w-full p-3 rounded-xl bg-slate-50 dark:bg-[#040913] border border-slate-200 dark:border-[#183657] text-slate-900 dark:text-white text-xs sm:text-sm font-sans leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#168BFF]/40 focus:border-[#168BFF] placeholder-slate-400 dark:placeholder-[#91A6BF] transition resize-y font-mono ${
                isExpanded ? 'flex-1 h-full' : ''
              }`}
            />
          </div>

          {/* Quick Note Suggestions / Key Points to remember */}
          {defaultKeyPoints && defaultKeyPoints.length > 0 && (
            <div className="pt-2 border-t border-slate-200 dark:border-[#183657]">
              <span className="text-[10px] font-bold text-slate-500 dark:text-[#91A6BF] block mb-1">
                💡 Quick Point to Add:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {defaultKeyPoints.slice(0, 3).map((pt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleInsertKeyPoint(pt)}
                    className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#102541] dark:hover:bg-[#183657] text-blue-600 dark:text-[#8CC8FF] rounded-md border border-slate-200 dark:border-[#183657] transition cursor-pointer text-left"
                    title="Click to add to your notes"
                  >
                    + {pt.length > 45 ? pt.slice(0, 45) + '...' : pt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-[#91A6BF] pt-1">
            <span>💾 Notes persist automatically in your browser.</span>
            <span>{noteContent.length} chars</span>
          </div>
        </div>
      )}
    </div>
  );
}
