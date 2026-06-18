import styled from '@emotion/styled';

/**
 * Folder filter — matches the Claude Design spec: a normal-case medium-weight
 * pill (distinct from the uppercase mono method chips) that reveals a dropdown
 * of top-level folders. Active state adopts the brand accent (outline + text).
 */
export const FilterWrapper = styled.div`
  position: relative;
  display: inline-flex;

  .oc-folder-filter__button {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-sans);
    font-size: 11.5px;
    font-weight: 500;
    padding: 3px 9px;
    cursor: pointer;
    color: var(--oc-colors-text-subtext1);
    background: transparent;
    border: 1px solid var(--oc-border-border2);
    border-radius: 5px;
    transition: border-color 0.12s ease, color 0.12s ease;
  }

  .oc-folder-filter__button:hover {
    color: var(--oc-text);
  }

  .oc-folder-filter__button[aria-expanded='true'],
  .oc-folder-filter__button.is-active {
    color: var(--oc-accents-primary);
    border-color: var(--oc-accents-primary);
  }

  .oc-folder-filter__button:focus-visible {
    outline: 2px solid var(--oc-accents-primary);
    outline-offset: 1px;
  }

  .oc-folder-filter__chevron {
    display: inline-flex;
    transition: transform 0.12s ease;
  }
  .oc-folder-filter__button[aria-expanded='true'] .oc-folder-filter__chevron {
    transform: rotate(180deg);
  }

  .oc-folder-filter__menu {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    z-index: 12;
    min-width: 180px;
    max-height: 240px;
    overflow-y: auto;
    padding: 4px;
    background: var(--oc-background-base);
    border: 1px solid var(--oc-border-border1);
    border-radius: 8px;
  }

  .oc-folder-filter__option {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 7px 9px;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 12.5px;
    font-weight: 400;
    text-align: left;
    color: var(--oc-text);
    background: transparent;
    border: 0;
    border-radius: 5px;
  }

  .oc-folder-filter__option:hover,
  .oc-folder-filter__option:focus-visible {
    outline: none;
    background: var(--oc-background-mantle);
  }

  .oc-folder-filter__option.is-selected {
    font-weight: 600;
    color: var(--oc-accents-primary);
    background: color-mix(in srgb, var(--oc-accents-primary) 10%, transparent);
  }

  .oc-folder-filter__option svg {
    flex-shrink: 0;
    color: var(--oc-colors-text-subtext1);
  }
  .oc-folder-filter__option.is-selected svg {
    color: var(--oc-accents-primary);
  }
`;
