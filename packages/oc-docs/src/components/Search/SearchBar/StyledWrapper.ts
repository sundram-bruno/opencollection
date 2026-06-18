import styled from '@emotion/styled';

/**
 * In-place, header-anchored search (BRU-3573) — Slack-style. The search field
 * lives in the Topbar's searchSlot; on focus it expands into a dropdown panel
 * that drops directly below it (no centered modal, no full-page dim).
 *
 * Sizing matches the Figma "Dropdown" frame: panel width 682, radius 10
 * (--oc-border-radius-lg), 1px border in --oc-border-border2; filter row 43px.
 * The panel is absolutely positioned so opening it never reflows the header.
 */
export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 36px; /* reserve the collapsed footprint so the header never reflows */
  font-family: var(--font-sans);

  .oc-search__panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: var(--oc-background-surface0);
    border: 1px solid var(--oc-border-border1);
    border-radius: var(--oc-border-radius-md);
    overflow: hidden;
  }

  .oc-search__panel[data-open='true'] {
    z-index: 50;
    width: min(682px, calc(100vw - 32px));
    max-height: min(454px, calc(100vh - 72px));
    background: var(--oc-background-base);
    border-color: var(--oc-border-border2);
    border-radius: var(--oc-border-radius-lg);
    box-shadow: var(--oc-dropdown-shadow);
    padding: 1px;
    /* visible so the folder dropdown can overhang the panel without clipping */
    overflow: visible;
  }

  /* Search field row */
  .oc-search__inputrow {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 12px;
    flex-shrink: 0;
  }
  .oc-search__panel[data-open='true'] .oc-search__inputrow {
    height: 52px;
    padding: 0 14px;
    gap: 10px;
    border-bottom: 1px solid var(--oc-border-border1);
  }

  .oc-search__inputrow > svg {
    flex-shrink: 0;
    color: var(--oc-colors-text-muted);
  }

  .oc-search__input {
    flex: 1 1 auto;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    color: var(--oc-text);
  }
  .oc-search__input::placeholder {
    color: var(--oc-colors-text-muted);
  }

  /* Filter row (open only) */
  .oc-search__filters {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 43px;
    padding: 0 14px;
    flex-shrink: 0;
    border-bottom: 1px solid var(--oc-border-border1);
  }

  .oc-search__clear {
    margin-left: auto;
    padding: 4px 2px;
    cursor: pointer;
    background: transparent;
    border: 0;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    color: var(--oc-colors-text-muted);
    white-space: nowrap;
  }
  .oc-search__clear:hover {
    color: var(--oc-accents-primary);
  }

  /* Results (open only) */
  .oc-search__results {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 6px;
  }

  .oc-search__list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .oc-search__empty {
    border: 0;
    min-height: 13rem;
  }

  /* Mobile: the Topbar reveals a full-width search row — fill it. */
  @media (max-width: 767px) {
    .oc-search__panel[data-open='true'] {
      width: 100%;
      max-height: min(70vh, calc(100vh - 96px));
    }
  }
`;
