import styled from '@emotion/styled';

/**
 * Folder filter: a toggle button that reveals a dropdown of top-level folders.
 * Active (a folder chosen) state adopts the accent colour, matching the method
 * chips' active treatment. Theme tokens throughout.
 */
export const FilterWrapper = styled.div`
  position: relative;
  display: inline-flex;

  .oc-folder-filter__button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 5px 10px 5px 12px;
    cursor: pointer;
    color: var(--oc-colors-text-muted);
    background: transparent;
    border: 1px solid var(--oc-border-border1);
    border-radius: var(--oc-border-radius-md);
    transition: border-color 0.12s ease, color 0.12s ease, background 0.12s ease;
  }

  .oc-folder-filter__button:hover {
    border-color: var(--oc-border-border2);
    color: var(--oc-text);
  }

  .oc-folder-filter__button[aria-expanded='true'],
  .oc-folder-filter__button.is-active {
    color: var(--oc-accents-primary);
    border-color: var(--oc-accents-primary);
    background: color-mix(in srgb, var(--oc-accents-primary) 8%, transparent);
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
    top: calc(100% + 6px);
    left: 0;
    z-index: 2;
    min-width: 220px;
    max-height: 320px;
    overflow-y: auto;
    padding: 6px;
    background: var(--oc-dropdown-bg);
    border: 1px solid var(--oc-dropdown-border);
    border-radius: var(--oc-border-radius-md);
    box-shadow: var(--oc-dropdown-shadow);
  }

  .oc-folder-filter__option {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 10px;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    text-align: left;
    color: var(--oc-dropdown-color);
    background: transparent;
    border: 0;
    border-radius: var(--oc-border-radius-sm);
  }

  .oc-folder-filter__option:hover,
  .oc-folder-filter__option:focus-visible {
    outline: none;
    background: var(--oc-dropdown-hover-bg);
  }

  .oc-folder-filter__option.is-selected {
    color: var(--oc-dropdown-selected-color);
  }

  .oc-folder-filter__option svg {
    flex-shrink: 0;
    color: var(--oc-dropdown-icon-color);
  }
`;
