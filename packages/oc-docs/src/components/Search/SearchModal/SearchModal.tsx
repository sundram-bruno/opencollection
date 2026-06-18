import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
import { EmptyState } from '../../EmptyState';
import { IconButton } from '../../IconButton';
import { SearchIcon, CloseIcon } from '../../../assets/icons';
import { MethodChips } from '../MethodChips';
import { FolderFilter } from '../FolderFilter';
import { SearchResultItem } from '../SearchResultItem';
import { Overlay, ModalCard } from './StyledWrapper';

export interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE = 'a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])';

/**
 * The endpoint search palette (BRU-3573). Fuzzy text search over name/url/params/
 * description, plus modal-local method + folder filters. Selecting a result
 * navigates via the BRU-3188 slug route. The typed query (text only) is mirrored
 * into the shared search slice — debounced — so the sidebar (BRU-3574) can filter
 * its tree; the filter chips never touch the slice.
 */
export const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const model = useNavModel();

  const records = useMemo(() => buildSearchRecords(model.ordered), [model]);
  const folders = useMemo(() => collectTopLevelFolders(model.ordered), [model]);

  const [query, setQueryText] = useState('');
  const [methods, setMethods] = useState<Set<string>>(() => new Set());
  const [folder, setFolder] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const hasQuery = query.trim().length > 0;
  const hasFilter = methods.size > 0 || folder !== null;

  // Results: ranked by text when a query is present, otherwise the full list in
  // nav order when only filters are active (matches the Figma — picking a method
  // or folder with empty text lists those endpoints). Filters apply locally.
  const results = useMemo(() => {
    const base = hasQuery ? searchRecords(query, records) : hasFilter ? records : [];
    return base.filter(
      (r) =>
        (methods.size === 0 || (r.method ? methods.has(r.method.toUpperCase()) : false)) &&
        (folder === null || r.ancestorSlugs.includes(folder)),
    );
  }, [query, methods, folder, records, hasQuery, hasFilter]);

  useEffect(() => setActiveIdx(0), [results]);

  // Mirror the TEXT query into the shared slice, debounced so the sidebar's tree
  // filter doesn't thrash on every keystroke. Filters are intentionally excluded.
  const debouncedQuery = useDebouncedValue(query, 140);
  useEffect(() => {
    if (!open) return;
    const q = debouncedQuery.trim();
    if (!q) {
      dispatch(clearSearch());
      return;
    }
    dispatch(setQuery(q));
    dispatch(setMatches(searchRecords(q, records).map((r) => r.id)));
  }, [debouncedQuery, open, records, dispatch]);

  // On open: remember focus + focus the input. On close/unmount: clear the slice
  // and restore focus to the trigger.
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement;
    inputRef.current?.focus();
    return () => {
      dispatch(clearSearch());
      restoreFocusRef.current?.focus?.();
    };
  }, [open, dispatch]);

  const handleSelect = useCallback(
    (rec: SearchRecord) => {
      navigate(`/${rec.slug}`);
      onClose();
    },
    [navigate, onClose],
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

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
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
      return;
    }
    if (e.key === 'Tab') {
      // Focus trap: keep Tab within the dialog.
      const nodes = cardRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const activeEl = document.activeElement;
      if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!open) return null;

  return createPortal(
    <Overlay className="oc-search-overlay" onMouseDown={onClose}>
      <ModalCard
        className="oc-search-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Search endpoints"
        ref={cardRef}
        onKeyDown={onKeyDown}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="oc-search__inputrow">
          <SearchIcon />
          <input
            ref={inputRef}
            className="oc-search__input"
            type="text"
            placeholder="Search endpoints…"
            value={query}
            onChange={(e) => setQueryText(e.target.value)}
            aria-label="Search endpoints"
            autoComplete="off"
            spellCheck={false}
          />
          <IconButton label="Close search" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

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
          {!hasQuery && !hasFilter ? (
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
            <ul className="oc-search__list" role="listbox" aria-label="Search results">
              {results.map((rec, i) => (
                <li key={rec.id} role="option" aria-selected={i === activeIdx}>
                  <SearchResultItem record={rec} active={i === activeIdx} onSelect={handleSelect} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </ModalCard>
    </Overlay>,
    document.body,
  );
};

export default SearchModal;
