import React, { useEffect, useRef } from 'react';
import { SearchIcon } from '../../../assets/icons';
import { useTopbarLayout } from '../../../hooks/useTopbarLayout';
import { TriggerButton } from './StyledWrapper';

export interface SearchTriggerProps {
  /** Open the search palette. */
  onOpen: () => void;
}

/**
 * Input-styled pill rendered into the Topbar's searchSlot; clicking (or ⌘/Ctrl+K,
 * handled upstream) opens the search palette.
 *
 * Below desktop the Topbar only mounts this trigger once its search icon has
 * revealed the search row (BRU-3572) — i.e. the user already tapped search — so
 * we open the palette immediately on mount there, making it a single tap rather
 * than tap-icon-then-tap-pill.
 */
export const SearchTrigger: React.FC<SearchTriggerProps> = ({ onOpen }) => {
  const mode = useTopbarLayout();
  const autoOpened = useRef(false);

  useEffect(() => {
    if (mode !== 'desktop' && !autoOpened.current) {
      autoOpened.current = true;
      onOpen();
    }
  }, [mode, onOpen]);

  return (
    <TriggerButton type="button" onClick={onOpen} aria-haspopup="dialog" aria-label="Search endpoints">
      <SearchIcon />
      <span className="oc-search-trigger__label">Search endpoints…</span>
    </TriggerButton>
  );
};

export default SearchTrigger;
