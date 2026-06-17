import { customAlphabet } from 'nanoid';

// a customized version of nanoid without using _ and -
export const uuid = () => {
  // https://github.com/ai/nanoid/blob/main/url-alphabet/index.js
  const urlAlphabet = 'useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict';
  const customNanoId = customAlphabet(urlAlphabet, 21);

  return customNanoId();
};

export const DEFAULT_COLLECTION_VERSION = 'v1.0.0';

/**
 * Formats a raw collection version for consistent display across the UI.
 * Numeric versions are padded to a full major.minor.patch and prefixed with "v"
 * ("1" -> "v1.0.0", "2.1" -> "v2.1.0"); an existing "v"/"V" is preserved (no double "v").
 * Non-numeric / pre-release versions are shown as-is (only prefixed), and an unset
 * version falls back to the default.
 */
export const formatCollectionVersion = (version?: string | number | null): string => {
  if (version === null || version === undefined) return DEFAULT_COLLECTION_VERSION;

  const raw = String(version).trim();
  if (!raw) return DEFAULT_COLLECTION_VERSION;

  // Drop an existing leading "v"/"V" so we never end up with "vv...".
  const core = raw.replace(/^v/i, '').trim();
  if (!core) return DEFAULT_COLLECTION_VERSION;

  const segments = core.split('.');
  const isNumeric = segments.every((segment) => /^\d+$/.test(segment));

  // Only pad versions made up entirely of numeric segments; anything else
  // (pre-release, build metadata, etc.) is shown as-is to stay precise.
  if (!isNumeric) {
    return `v${core}`;
  }

  while (segments.length < 3) {
    segments.push('0');
  }

  return `v${segments.join('.')}`;
};
