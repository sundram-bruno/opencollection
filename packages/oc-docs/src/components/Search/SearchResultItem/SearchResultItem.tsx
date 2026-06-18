import React from 'react';
import Method from '../../Docs/Method/Method';
import type { SearchRecord } from '../../../utils/searchIndex';
import { ResultButton } from './StyledWrapper';

export interface SearchResultItemProps {
  record: SearchRecord;
  /** Whether this row is the active (keyboard-highlighted) result. */
  active?: boolean;
  /** Navigate to this result (caller also closes the palette). */
  onSelect: (record: SearchRecord) => void;
}

/** One result row in the search palette. Reuses the shared `Method` badge so the
 * method colouring matches the sidebar and everywhere else. */
export const SearchResultItem: React.FC<SearchResultItemProps> = ({ record, active = false, onSelect }) => (
  <ResultButton type="button" data-active={active} onClick={() => onSelect(record)}>
    {record.method && <Method method={record.method} className="oc-search-result__badge" />}
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
