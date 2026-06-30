import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavModel } from '../../../routing/hooks';
import {
  buildSearchRecords,
  collectTopLevelFolders,
  collectMethods,
  searchRecords,
  type SearchRecord,
} from '../searchIndex';
import { SearchIcon, CloseIcon } from '../../../assets/icons';
import MethodChips from '../MethodChips/MethodChips';
import FolderFilter from '../FolderFilter/FolderFilter';
import SearchResultItem from '../SearchResultItem/SearchResultItem';
import { StyledWrapper } from './StyledWrapper';

const RESULTS_ID = 'search-listbox';

interface SearchBarProps {
  /** Open state, controlled by the shell so it is shared with the Topbar's
   *  below-desktop search row (one source of truth: icon, row and panel agree). */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Changes on each hotkey press to refocus the field even when already open. */
  focusNonce?: number;
  testId?: string;
}

/**
 * Header-anchored endpoint search. Fuzzy text search over name/url/params/
 * description plus palette-local method + folder filters. Results render in the
 * palette itself and selecting one navigates via the slug route.
 *
 * Expands in place (a combobox whose listbox drops directly below the field)
 * rather than opening a centered modal. Open state is controlled so the Topbar
 * search icon/row and this panel share one state (no redundant affordances).
 */
export const SearchBar: React.FC<SearchBarProps> = ({ open, onOpenChange, focusNonce, testId = 'search' }) => {
  const navigate = useNavigate();
  const model = useNavModel();

  const records = useMemo(() => buildSearchRecords(model.ordered), [model]);
  const folders = useMemo(() => collectTopLevelFolders(model.ordered), [model]);
  // One chip per method present in the collection (canonical order).
  const methodOptions = useMemo(() => collectMethods(model.ordered), [model]);

  const [query, setQueryText] = useState('');
  const [methods, setMethods] = useState<Set<string>>(() => new Set());
  const [folder, setFolder] = useState<string | null>(null);
  // -1 = no keyboard selection yet, so no row shows the active highlight until
  // the user actually arrow-keys (mouse filtering shouldn't pre-highlight row 0).
  const [activeIdx, setActiveIdx] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasQuery = query.trim().length > 0;
  const hasFilter = methods.size > 0 || folder !== null;

  const results = useMemo(() => {
    const base = hasQuery ? searchRecords(query, records) : hasFilter ? records : [];
    return base.filter(
      (r) =>
        (methods.size === 0 || (r.method ? methods.has(r.method.toUpperCase()) : false)) &&
        (folder === null || r.ancestorSlugs.includes(folder)),
    );
  }, [query, methods, folder, records, hasQuery, hasFilter]);

  useEffect(() => setActiveIdx(-1), [results]);

  // Focus the field whenever the panel opens (incl. when the Topbar icon mounts
  // this already-open below desktop, or the shortcut opens it from the shell).
  // `focusNonce` bumps on each hotkey press so ⌘K refocuses even when the panel
  // is already open and the field had lost focus.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, focusNonce]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open, onOpenChange]);

  const toggleMethod = useCallback((method: string) => {
    setMethods((prev) => {
      const next = new Set(prev);
      if (next.has(method)) next.delete(method);
      else next.add(method);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setMethods(new Set());
    setFolder(null);
  }, []);

  // Reset query + filters and close. Used by ✕ / Escape and after navigating to
  // a result, so the query and filters don't linger on the next open.
  const resetAndClose = useCallback(() => {
    setQueryText('');
    clearFilters();
    onOpenChange(false);
  }, [clearFilters, onOpenChange]);

  const handleSelect = useCallback(
    (rec: SearchRecord) => {
      navigate(`/${rec.slug}`);
      resetAndClose();
    },
    [navigate, resetAndClose],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (query || hasFilter) resetAndClose();
      else onOpenChange(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) onOpenChange(true);
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      // Enter selects the highlighted row, or the first result if none navigated.
      const rec = activeIdx >= 0 ? results[activeIdx] : results[0];
      if (rec) {
        e.preventDefault();
        handleSelect(rec);
      }
    }
  };

  const showInitial = !hasQuery && !hasFilter;

  return (
    <StyledWrapper ref={wrapperRef} role="search" data-testid={testId}>
      <div className="search-panel" data-open={open} data-testid="search-panel">
        <div className="search-inputrow">
          <span className="search-field-icon">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search endpoints…"
            value={query}
            role="combobox"
            aria-expanded={open}
            aria-controls={RESULTS_ID}
            aria-autocomplete="list"
            aria-label="Search endpoints"
            autoComplete="off"
            spellCheck={false}
            onFocus={() => onOpenChange(true)}
            onChange={(e) => {
              setQueryText(e.target.value);
              onOpenChange(true);
            }}
            onKeyDown={onKeyDown}
          />
          {open && (
            <button type="button" className="search-close" aria-label="Clear search" onClick={resetAndClose}>
              <CloseIcon />
            </button>
          )}
        </div>

        {open && (
          <>
            <div className="search-filters" data-testid="search-filters">
              <MethodChips methods={methodOptions} active={methods} onToggle={toggleMethod} />
              <FolderFilter folders={folders} value={folder} onChange={setFolder} />
              {hasFilter && (
                <button type="button" className="search-clear" onClick={clearFilters}>
                  Clear all
                </button>
              )}
            </div>

            <div className="search-results">
              {showInitial ? (
                <div className="search-empty">
                  <span className="search-empty-icon" data-tone="brand" aria-hidden="true">
                    <SearchIcon />
                  </span>
                  <p className="search-empty-title">Search the collection</p>
                  <p className="search-empty-text">Find any request by name, endpoint, or description.</p>
                </div>
              ) : results.length === 0 ? (
                <div className="search-empty">
                  <span className="search-empty-icon" data-tone="muted" aria-hidden="true">
                    <SearchIcon />
                  </span>
                  <p className="search-empty-title">No matching requests</p>
                  <p className="search-empty-text">
                    Nothing matches {hasQuery ? <>“<b>{query}</b>”</> : 'these filters'}. Try a different
                    term or clear the filters.
                  </p>
                  {hasFilter && (
                    <button type="button" className="search-empty-clear" onClick={clearFilters}>
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <ul
                  className="search-list"
                  id={RESULTS_ID}
                  role="listbox"
                  aria-label="Search results"
                  data-testid="search-results"
                >
                  {results.map((rec, i) => (
                    <li key={rec.id} role="option" aria-selected={i === activeIdx}>
                      <SearchResultItem record={rec} active={i === activeIdx} onSelect={handleSelect} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </StyledWrapper>
  );
};

export default SearchBar;
