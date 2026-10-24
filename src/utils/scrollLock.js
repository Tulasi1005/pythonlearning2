import { useEffect } from "react";

let activeLocksCount = 0;
let originalOverflow = "";
let originalPaddingRight = "";

/**
 * Locks background document scroll while preserving scrollbar width to prevent layout shift.
 */
export function lockBodyScroll() {
  if (typeof document === "undefined") return;

  if (activeLocksCount === 0) {
    originalOverflow = document.body.style.overflow || "";
    originalPaddingRight = document.body.style.paddingRight || "";

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  activeLocksCount++;
}

/**
 * Decrements active modal locks and restores body overflow and padding when all modals close.
 */
export function unlockBodyScroll() {
  if (typeof document === "undefined") return;

  activeLocksCount = Math.max(0, activeLocksCount - 1);

  if (activeLocksCount === 0) {
    document.body.style.overflow = originalOverflow;
    document.documentElement.style.overflow = "";
    document.body.style.paddingRight = originalPaddingRight;
    document.body.style.overscrollBehavior = "";
    document.documentElement.style.overscrollBehavior = "";
  }
}

/**
 * React Hook to automatically lock background scrolling when a modal or drawer is open.
 * @param {boolean} isLocked - whether the modal is currently open
 */
export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    lockBodyScroll();

    return () => {
      unlockBodyScroll();
    };
  }, [isLocked]);
}
