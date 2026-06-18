import { useEffect } from 'react';

/**
 * Platform-aware search shortcut (BRU-3573): ⌘K on macOS, Ctrl+K elsewhere.
 * Never hardcodes ⌘ — Windows/Linux users get Ctrl+K.
 */

/** True on macOS/iOS. Pure so it can be tested against a navigator-like object. */
export const isMacPlatform = (
  nav: { platform?: string; userAgent?: string } = typeof navigator !== 'undefined' ? navigator : {},
): boolean => /Mac|iPhone|iPad|iPod/.test(nav.platform || '') || /Mac OS X/.test(nav.userAgent || '');

/** Whether a keydown event is the platform's search shortcut. */
export const matchesSearchHotkey = (
  e: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey'>,
  isMac: boolean,
): boolean => {
  if ((e.key || '').toLowerCase() !== 'k') return false;
  // Require the platform modifier and reject the other, so ⌘K on Windows or
  // Ctrl+K on Mac (different OS shortcuts) don't both fire.
  return isMac ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey;
};

/** Attach a document keydown listener that fires `onTrigger` on the shortcut. */
export const useSearchHotkey = (onTrigger: () => void): void => {
  useEffect(() => {
    const isMac = isMacPlatform();
    const onKeyDown = (e: KeyboardEvent) => {
      if (matchesSearchHotkey(e, isMac)) {
        e.preventDefault();
        onTrigger();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onTrigger]);
};
