import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { setQuery, setMatches, clearSearch } from '../../../store/slices/search';
import { useNavModel } from '../../../routing/hooks';
import {
  buildSearchRecords,
  collectTopLevelFolders,
  searchRecords,
  type SearchRecord,
} from '../../../utils/searchIndex';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { SearchIcon, CloseIcon } from '../../../assets/icons';
import { MethodChips } from '../MethodChips';
import { FolderFilter } from '../FolderFilter';
import { SearchResultItem } from '../SearchResultItem';
import { SearchWrapper } from './StyledWrapper';

const RESULTS_ID = 'oc-search-results';

export interface SearchBarProps {
  /** Open state — controlled by AppShell so it is shared with the Topbar's
   *  below-desktop search row (one source of truth: icon, row and panel agree). */
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Header-anchored endpoint search (BRU-3573). Fuzzy text search over name/url/
 * params/description plus modal-local method + folder filters. Selecting a result
 * navigates via the BRU-3188 slug route. The typed query (text only, debounced)
 * is mirrored into the shared search slice so the sidebar (BRU-3574) can filter
 * its tree; the filter chips stay local and never touch the slice.
 *
 * Expands in place (Slack-style) rather than opening a centered modal: a combobox
 * whose listbox drops directly below the field. Open state is controlled so the
 * Topbar search icon/row and this panel share one state (no redundant affordances).
 */
export const SearchBar: React.FC<SearchBarProps> = ({ open, onOpenChange }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const model = useNavModel();

  const records = useMemo(() => buildSearchRecords(model.ordered), [model]);
  const folders = useMemo(() => collectTopLevelFolders(model.ordered), [model]);

  const [query, setQueryText] = useState('');
  const [methods, setMethods] = useState<Set<string>>(() => new Set());
  const [folder, setFolder] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

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

  useEffect(() => setActiveIdx(0), [results]);

  // Mirror the TEXT query into the shared slice (debounced) — filters excluded.
  const debouncedQuery = useDebouncedValue(query, 140);
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      dispatch(clearSearch());
      return;
    }
    dispatch(setQuery(q));
    dispatch(setMatches(searchRecords(q, records).map((r) => r.id)));
  }, [debouncedQuery, records, dispatch]);

  // Focus the field whenever the panel opens (incl. when the Topbar icon mounts
  // this already-open below desktop, or ⌘K opens it from AppShell).
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open, onOpenChange]);

  const handleSelect = useCallback(
    (rec: SearchRecord) => {
      navigate(`/${rec.slug}`);
      onOpenChange(false);
    },
    [navigate, onOpenChange],
  );

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

  const clearAndClose = useCallback(() => {
    setQueryText('');
    clearFilters();
    onOpenChange(false);
  }, [clearFilters, onOpenChange]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (query || hasFilter) clearAndClose();
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
      const rec = results[activeIdx];
      if (rec) {
        e.preventDefault();
        handleSelect(rec);
      }
    }
  };

  const showInitial = !hasQuery && !hasFilter;

  return (
    <SearchWrapper ref={wrapperRef} role="search">
      <div className="oc-search__panel" data-open={open}>
        <div className="oc-search__inputrow">
          <span className="oc-search__icon">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            className="oc-search__input"
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
            <button
              type="button"
              className="oc-search__close"
              aria-label="Clear search"
              onClick={clearAndClose}
            >
              <CloseIcon />
            </button>
          )}
        </div>

        {open && (
          <>
            <div className="oc-search__filters">
              <MethodChips active={methods} onToggle={toggleMethod} />
              <FolderFilter folders={folders} value={folder} onChange={setFolder} />
              {hasFilter && (
                <button type="button" className="oc-search__clear" onClick={clearFilters}>
                  Clear all
                </button>
              )}
            </div>

            <div className="oc-search__results">
              {showInitial ? (
                <div className="oc-search__empty">
                  <span className="oc-search__empty-icon" data-tone="brand" aria-hidden="true">
                    <SearchIcon />
                  </span>
                  <p className="oc-search__empty-title">Search the collection</p>
                  <p className="oc-search__empty-text">
                    Find any request by name, endpoint, or description.
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="oc-search__empty">
                  <span className="oc-search__empty-icon" data-tone="muted" aria-hidden="true">
                    <SearchIcon />
                  </span>
                  <p className="oc-search__empty-title">No matching requests</p>
                  <p className="oc-search__empty-text">
                    Nothing matches {hasQuery ? <>“<b>{query}</b>”</> : 'these filters'}. Try a
                    different term or clear the filters.
                  </p>
                  {hasFilter && (
                    <button type="button" className="oc-search__empty-clear" onClick={clearFilters}>
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <ul className="oc-search__list" id={RESULTS_ID} role="listbox" aria-label="Search results">
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
    </SearchWrapper>
  );
};

export default SearchBar;
