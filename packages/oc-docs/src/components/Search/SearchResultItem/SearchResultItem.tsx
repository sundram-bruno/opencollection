import React from 'react';
import { getMethodColorVar } from '../../../theme/methodColors';
import type { SearchRecord } from '../../../utils/searchIndex';
import { ResultButton } from './StyledWrapper';

export interface SearchResultItemProps {
  record: SearchRecord;
  /** Whether this row is the active (keyboard-highlighted) result. */
  active?: boolean;
  /** Navigate to this result (caller also closes the palette). */
  onSelect: (record: SearchRecord) => void;
}

/** Short method label, matching the design (DELETE → DEL, OPTIONS → OPT). */
const shortMethod = (method: string): string => {
  const m = method.toUpperCase();
  if (m === 'DELETE') return 'DEL';
  if (m === 'OPTIONS') return 'OPT';
  return m;
};

/**
 * One result row in the search palette. The method is rendered as a plain
 * colour-coded mono label (the design's `MethodPill` text style) — not the
 * filled sidebar badge — while still sourcing its colour from the shared
 * `getMethodColorVar` token so methods stay consistent app-wide.
 */
export const SearchResultItem: React.FC<SearchResultItemProps> = ({ record, active = false, onSelect }) => (
  <ResultButton type="button" data-active={active} data-testid="search-result" onClick={() => onSelect(record)}>
    {record.method && (
      <span
        className="oc-search-result__method"
        data-testid="search-result-method"
        style={{ ['--method-color' as string]: getMethodColorVar(record.method) }}
      >
        {shortMethod(record.method)}
      </span>
    )}
    <span className="oc-search-result__body">
      <span className="oc-search-result__title-row">
        <span className="oc-search-result__name">{record.name}</span>
        {record.breadcrumb && (
          <span className="oc-search-result__breadcrumb">{record.breadcrumb}</span>
        )}
      </span>
      {record.url && <span className="oc-search-result__url">{record.url}</span>}
    </span>
  </ResultButton>
);

export default SearchResultItem;
