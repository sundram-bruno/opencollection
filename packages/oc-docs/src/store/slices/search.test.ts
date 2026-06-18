import { describe, it, expect } from 'vitest';
import reducer, {
  setQuery,
  setMatches,
  clearSearch,
  selectSearchQuery,
  selectMatchingItemIds,
  type SearchState,
} from './search';

const init = (): SearchState => reducer(undefined, { type: '@@INIT' });

describe('searchSlice', () => {
  it('defaults to empty query and null matches (no active search)', () => {
    expect(init()).toEqual({ query: '', matchingItemIds: null });
  });

  it('setQuery sets only the query, never touches matches', () => {
    const next = reducer(init(), setQuery('hotel'));
    expect(next.query).toBe('hotel');
    expect(next.matchingItemIds).toBeNull();
  });

  it('setMatches stores the matching item ids', () => {
    const next = reducer({ query: 'hotel', matchingItemIds: null }, setMatches(['uuid-a', 'uuid-b']));
    expect(next.matchingItemIds).toEqual(['uuid-a', 'uuid-b']);
  });

  it('setMatches(null) resets matches to "show everything" without clearing the query', () => {
    const next = reducer({ query: 'hotel', matchingItemIds: ['uuid-a'] }, setMatches(null));
    expect(next.matchingItemIds).toBeNull();
    expect(next.query).toBe('hotel');
  });

  it('clearSearch resets both query and matches', () => {
    const next = reducer({ query: 'hotel', matchingItemIds: ['uuid-a'] }, clearSearch());
    expect(next).toEqual({ query: '', matchingItemIds: null });
  });

  it('selectors read query and matches off root state', () => {
    const root = { search: { query: 'q', matchingItemIds: ['x'] } } as never;
    expect(selectSearchQuery(root)).toBe('q');
    expect(selectMatchingItemIds(root)).toEqual(['x']);
  });
});
