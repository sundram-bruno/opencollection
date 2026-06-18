import { describe, it, expect } from 'vitest';
import { isMacPlatform, matchesSearchHotkey } from './useSearchHotkey';

describe('isMacPlatform', () => {
  it('detects macOS / iOS by platform', () => {
    expect(isMacPlatform({ platform: 'MacIntel' })).toBe(true);
    expect(isMacPlatform({ platform: 'iPhone' })).toBe(true);
  });
  it('detects macOS by user agent', () => {
    expect(isMacPlatform({ platform: '', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)' })).toBe(true);
  });
  it('is false on Windows / Linux', () => {
    expect(isMacPlatform({ platform: 'Win32' })).toBe(false);
    expect(isMacPlatform({ platform: 'Linux x86_64' })).toBe(false);
  });
});

describe('matchesSearchHotkey', () => {
  it('fires on ⌘K on Mac, not Ctrl+K', () => {
    expect(matchesSearchHotkey({ key: 'k', metaKey: true, ctrlKey: false }, true)).toBe(true);
    expect(matchesSearchHotkey({ key: 'k', metaKey: false, ctrlKey: true }, true)).toBe(false);
  });
  it('fires on Ctrl+K off Mac, not ⌘K', () => {
    expect(matchesSearchHotkey({ key: 'k', metaKey: false, ctrlKey: true }, false)).toBe(true);
    expect(matchesSearchHotkey({ key: 'k', metaKey: true, ctrlKey: false }, false)).toBe(false);
  });
  it('is case-insensitive on the key', () => {
    expect(matchesSearchHotkey({ key: 'K', metaKey: true, ctrlKey: false }, true)).toBe(true);
  });
  it('ignores other keys', () => {
    expect(matchesSearchHotkey({ key: 'j', metaKey: true, ctrlKey: false }, true)).toBe(false);
  });
});
