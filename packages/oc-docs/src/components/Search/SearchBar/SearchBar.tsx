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
import { useSearchHotkey } from '../../../hooks/useSearchHotkey';
import { useTopbarLayout } from '../../../hooks/useTopbarLayout';
import { EmptyState } from '../../EmptyState';
import { IconButton } from '../../IconButton';
import { SearchIcon, CloseIcon } from '../../../assets/icons';
import { MethodChips } from '../MethodChips';
import { FolderFilter } from '../FolderFilter';
import { SearchResultItem } from '../SearchResultItem';
import { SearchWrapper } from './StyledWrapper';

const RESULTS_ID = 'oc-search-results';

/**
 * Header-anchored endpoint search (BRU-3573). Fuzzy text search over name/url/
 * params/description plus modal-local method + folder filters. Selecting a result
 * navigates via the BRU-3188 slug route. The typed query (text only, debounced)
 * is mirrored into the shared search slice so the sidebar (BRU-3574) can filter
 * its tree; the filter chips stay local and never touch the slice.
 *
 * Expands in place (Slack-style) rather than opening a centered modal: a combobox
 * whose listbox drops directly below the field.
 */
export const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const model = useNavModel();
  const mode = useTopbarLayout();

  const records = useMemo(() => buildSearchRecords(model.ordered), [model]);
  const folders = useMemo(() => collectTopLevelFolders(model.ordered), [model]);

  const [open, setOpen] = useState(false);
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

  const openPanel = useCallback(() => {
    setOpen(true);
    inputRef.current?.focus();
  }, []);

  // Platform-aware ⌘K / Ctrl+K focuses (and opens) the field.
  useSearchHotkey(openPanel);

  // Below desktop the Topbar only mounts this once its search icon reveals the
  // row — i.e. the user already tapped search — so open immediately there.
  const autoOpened = useRef(false);
  useEffect(() => {
    if (mode !== 'desktop' && !autoOpened.current) {
      autoOpened.current = true;
      openPanel();
    }
  }, [mode, openPanel]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  const handleSelect = useCallback(
    (rec: SearchRecord) => {
      navigate(`/${rec.slug}`);
      setOpen(false);
    },
    [navigate],
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
    setOpen(false);
  }, [clearFilters]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (query || hasFilter) clearAndClose();
      else setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) openPanel();
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
          <SearchIcon />
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
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQueryText(e.target.value);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
          />
          {open && (
            <IconButton label="Clear search" onClick={clearAndClose}>
              <CloseIcon />
            </IconButton>
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
                <EmptyState
                  className="oc-search__empty"
                  icon={<SearchIcon />}
                  heading="Search the collection"
                  subheading="Find any request by name, endpoint, or description."
                />
              ) : results.length === 0 ? (
                <EmptyState
                  className="oc-search__empty"
                  icon={<SearchIcon />}
                  heading="No results"
                  subheading="No endpoints match your search. Try a different term or filter."
                />
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
