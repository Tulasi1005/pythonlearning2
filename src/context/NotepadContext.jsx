import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const NotepadContext = createContext(null);

export function NotepadProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("topic"); // 'topic' | 'scratchpad'
  
  // Topic context
  const [currentTopicId, setCurrentTopicId] = useState("what-is-python");
  const [currentTopicTitle, setCurrentTopicTitle] = useState("What is Python?");
  const [defaultKeyPoints, setDefaultKeyPoints] = useState([]);

  // Open notepad with optional topic parameters
  const openNotepad = useCallback((options = {}) => {
    if (options.topicId) setCurrentTopicId(options.topicId);
    if (options.topicTitle) setCurrentTopicTitle(options.topicTitle);
    if (options.defaultKeyPoints) setDefaultKeyPoints(options.defaultKeyPoints);
    if (options.tab) setActiveTab(options.tab);
    
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const closeNotepad = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const toggleNotepad = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setIsMinimized(false);
      return !prev;
    });
  }, []);

  const minimizeNotepad = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const restoreNotepad = useCallback(() => {
    setIsMinimized(false);
    setIsOpen(true);
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Update current topic context without forcibly opening the notepad (guarded against re-renders)
  const setTopicContext = useCallback(({ topicId, topicTitle, defaultKeyPoints: keyPoints = [] }) => {
    if (topicId) {
      setCurrentTopicId((prev) => (prev !== topicId ? topicId : prev));
    }
    if (topicTitle) {
      setCurrentTopicTitle((prev) => (prev !== topicTitle ? topicTitle : prev));
    }
    if (keyPoints) {
      setDefaultKeyPoints((prev) => {
        if (prev.length === keyPoints.length && prev.every((pt, idx) => pt === keyPoints[idx])) {
          return prev;
        }
        return keyPoints;
      });
    }
  }, []);

  // Global Keyboard shortcut: Alt + N to toggle notepad
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        toggleNotepad();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleNotepad]);

  return (
    <NotepadContext.Provider
      value={{
        isOpen,
        isMinimized,
        isExpanded,
        activeTab,
        currentTopicId,
        currentTopicTitle,
        defaultKeyPoints,
        openNotepad,
        closeNotepad,
        toggleNotepad,
        minimizeNotepad,
        restoreNotepad,
        toggleExpanded,
        setActiveTab,
        setTopicContext
      }}
    >
      {children}
    </NotepadContext.Provider>
  );
}

export function useNotepad() {
  const context = useContext(NotepadContext);
  if (!context) {
    throw new Error("useNotepad must be used within a NotepadProvider");
  }
  return context;
}
