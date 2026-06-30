import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  position: relative;
  display: inline-flex;

  .folder-filter-button {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 23px;
    padding: 0 8px;
    box-sizing: border-box;
    font-family: 'Fira Code', var(--font-mono);
    font-size: 11.5px;
    font-weight: 500;
    cursor: pointer;
    color: var(--oc-colors-text-subtext1);
    background: transparent;
    border: 1px solid var(--oc-border-border2);
    border-radius: 6px;
    transition: border-color 0.12s ease, color 0.12s ease;
  }

  .folder-filter-button:hover {
    color: var(--oc-text);
  }

  .folder-filter-button[aria-expanded='true'],
  .folder-filter-button.is-active {
    color: var(--oc-accents-primary);
    border-color: var(--oc-accents-primary);
  }

  .folder-filter-button:focus-visible {
    outline: 2px solid var(--oc-accents-primary);
    outline-offset: 1px;
  }

  .folder-filter-chevron {
    display: inline-flex;
    transition: transform 0.12s ease;
  }
  .folder-filter-button[aria-expanded='true'] .folder-filter-chevron {
    transform: rotate(180deg);
  }

  .folder-filter-menu {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    z-index: 12;
    width: 190px;
    max-height: 250px;
    overflow-y: auto;
    padding: 8px;
    background: var(--oc-background-base);
    border: 1px solid var(--oc-border-border1);
    border-radius: 8px;
  }

  .folder-filter-option {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 27px;
    padding: 7px 8px;
    box-sizing: border-box;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    line-height: 1;
    text-align: left;
    color: var(--oc-text);
    background: transparent;
    border: 0;
    border-radius: 5px;
  }

  .folder-filter-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .folder-filter-option:hover,
  .folder-filter-option:focus-visible {
    outline: none;
    background: var(--oc-background-mantle);
  }

  .folder-filter-option.is-selected {
    font-weight: 600;
    color: var(--oc-accents-primary);
    background: color-mix(in srgb, var(--oc-accents-primary) 8%, transparent);
  }

  .folder-filter-option svg {
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    color: var(--oc-colors-text-subtext1);
  }
  .folder-filter-option.is-selected svg {
    color: var(--oc-accents-primary);
  }

  @media (max-width: 767px) {
    .folder-filter-menu {
      left: auto;
      right: 0;
    }
  }
`;
