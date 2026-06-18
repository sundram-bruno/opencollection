import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

/**
 * Search slice (BRU-3573). Shared seam consumed read-only by the sidebar
 * (BRU-3574) to filter its tree.
 *
 * CONTRACT — keep stable:
 * - `query` is the raw text typed into the search palette.
 * - `matchingItemIds` is the set of items that match `query` (text only),
 *   or `null` when no search is active ("show everything").
 * - IDs are **item UUIDs** — the exact identifier sidebar tree nodes key on
 *   (`getItemUuid(item)`, see utils/itemUtils.ts). NOT route slugs. The sidebar
 *   maps these ids → tree nodes → expands ancestors; a slug here would silently
 *   match nothing.
 * - Text query is the ONLY input to `matchingItemIds`. Method/folder filter
 *   chips in the palette are modal-local and MUST NOT be written here (keeps
 *   AC4 — "filters while typing / clears on empty query" — exact, and the seam
 *   stable for BRU-3574).
 *
 * BRU-3573 is the only writer. The reducer stays pure: the component computes
 * matches over a memoized index (debounced) and dispatches `setMatches`.
 */
export interface SearchState {
  query: string;
  matchingItemIds: string[] | null;
}

const initialState: SearchState = {
  query: '',
  matchingItemIds: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    /** Set the raw query text only. Match computation happens in the component. */
    setQuery: (state: SearchState, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    /** Set the matching item UUIDs (debounced fuzzy result). `null` = no active search. */
    setMatches: (state: SearchState, action: PayloadAction<string[] | null>) => {
      state.matchingItemIds = action.payload;
    },
    /** Clear the search entirely — empty query, matches back to `null`. */
    clearSearch: (state: SearchState) => {
      state.query = '';
      state.matchingItemIds = null;
    },
  },
});

export const { setQuery, setMatches, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;

export const selectSearchQuery = (state: RootState) => state.search.query;
export const selectMatchingItemIds = (state: RootState) => state.search.matchingItemIds;
