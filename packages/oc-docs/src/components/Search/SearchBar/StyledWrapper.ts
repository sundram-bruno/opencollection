import styled from '@emotion/styled';

/**
 * In-place, header-anchored search (BRU-3573) — matches the Claude Design spec
 * 1:1 (design tokens mapped to --oc-* equivalents). The collapsed field lives
 * in the Topbar searchSlot; on focus it expands into a panel centered under the
 * field that drops below it (no centered modal, no page dim).
 */
export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 430px;
  height: 28px;
  font-family: var(--font-sans);

  /* Collapsed field + expanded panel are the same element (data-open toggles). */
  .oc-search__panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: var(--oc-background-mantle);
    border: 1px solid var(--oc-border-border1);
    border-radius: 6px;
    overflow: hidden;
  }

  .oc-search__panel[data-open='true'] {
    z-index: 10;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: min(680px, 92vw);
    max-height: min(454px, calc(100vh - 72px));
    background: var(--oc-background-base);
    border-color: var(--oc-border-border2);
    border-radius: 10px;
    /* visible so the folder dropdown can overhang without being clipped */
    overflow: visible;
  }

  /* Search field row */
  .oc-search__inputrow {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 28px;
    padding: 7px 8px;
    box-sizing: border-box;
    flex-shrink: 0;
  }
  .oc-search__panel[data-open='true'] .oc-search__inputrow {
    height: 40px;
    padding: 0 12px;
    gap: 9px;
    border-bottom: 1px solid var(--oc-border-border1);
  }

  .oc-search__icon {
    flex-shrink: 0;
    display: inline-flex;
    color: var(--oc-colors-text-subtext0);
  }
  .oc-search__icon svg {
    width: 15px;
    height: 15px;
  }
  .oc-search__panel[data-open='true'] .oc-search__icon {
    color: var(--oc-colors-text-subtext1);
  }

  .oc-search__input {
    flex: 1 1 auto;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    color: var(--oc-text);
  }
  .oc-search__panel[data-open='true'] .oc-search__input {
    font-size: 13px;
  }
  .oc-search__input::placeholder {
    color: var(--oc-colors-text-subtext1);
  }

  .oc-search__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    flex-shrink: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: 4px;
    color: var(--oc-colors-text-subtext1);
  }
  .oc-search__close svg {
    width: 14px;
    height: 14px;
  }
  .oc-search__close:hover {
    background: var(--oc-background-mantle);
  }

  /* Filter row */
  .oc-search__filters {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    padding: 10px 12px;
    flex-shrink: 0;
    border-bottom: 1px solid var(--oc-border-border1);
  }

  .oc-search__clear {
    margin-left: auto;
    padding: 2px 4px;
    cursor: pointer;
    background: transparent;
    border: 0;
    font-family: var(--font-sans);
    font-size: 11.5px;
    font-weight: 500;
    color: var(--oc-colors-text-subtext1);
    white-space: nowrap;
  }
  .oc-search__clear:hover {
    color: var(--oc-accents-primary);
  }

  /* Results */
  .oc-search__results {
    max-height: 360px;
    overflow-y: auto;
    padding: 4px;
  }

  .oc-search__list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Empty states (inline — the design uses a tinted rounded-square icon, not the
     shared dashed EmptyState card). */
  .oc-search__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 34px 20px 36px;
    gap: 4px;
  }
  .oc-search__empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    margin-bottom: 10px;
    border-radius: 14px;
  }
  .oc-search__empty-icon[data-tone='brand'] {
    background: color-mix(in srgb, var(--oc-accents-primary) 8%, transparent);
    color: var(--oc-accents-primary);
  }
  .oc-search__empty-icon[data-tone='muted'] {
    background: var(--oc-background-surface0);
    color: var(--oc-colors-text-subtext1);
  }
  .oc-search__empty-icon svg {
    width: 22px;
    height: 22px;
  }
  .oc-search__empty-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--oc-text);
  }
  .oc-search__empty-text {
    font-size: 12.5px;
    color: var(--oc-colors-text-subtext1);
    line-height: 1.5;
    max-width: 320px;
  }
  .oc-search__empty-text b {
    color: var(--oc-text);
    font-weight: 500;
  }
  .oc-search__empty-clear {
    margin-top: 10px;
    padding: 6px 14px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    color: var(--oc-accents-primary);
    background: color-mix(in srgb, var(--oc-accents-primary) 8%, transparent);
    border: 0;
    border-radius: 6px;
  }

  /* Below desktop (<1024) the Topbar collapses search to an icon that reveals a
     full-width row (BRU-3572). The collapsed field's max-width + left-aligned
     position there would push a centered 680px panel off-screen, so anchor the
     panel as a full-width fixed sheet instead. */
  @media (max-width: 1023px) {
    max-width: none;
    .oc-search__panel[data-open='true'] {
      position: fixed;
      top: 8px;
      left: 8px;
      right: 8px;
      width: auto;
      transform: none;
      max-height: min(70vh, calc(100vh - 96px));
    }
  }
`;
