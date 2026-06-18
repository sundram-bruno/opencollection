import styled from '@emotion/styled';

/**
 * A single search result row — matches the Claude Design spec: method badge +
 * name + folder path on the first line, request URL (mono) on the second.
 * Full-width button, one click target. Theme tokens throughout.
 */
export const ResultButton = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 11px;
  width: 100%;
  padding: 9px 10px;
  cursor: pointer;
  text-align: left;
  background: transparent;
  border: 0;
  border-radius: 7px;
  font-family: var(--font-sans);

  &:hover,
  &[data-active='true'] {
    background: var(--oc-background-mantle);
  }

  &:focus-visible {
    outline: 2px solid var(--oc-accents-primary);
    outline-offset: -2px;
  }

  .oc-search-result__badge {
    margin-top: 1px;
  }

  .oc-search-result__body {
    min-width: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .oc-search-result__title-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .oc-search-result__name {
    font-size: 13px;
    font-weight: 600;
    color: var(--oc-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .oc-search-result__breadcrumb {
    font-size: 11px;
    color: var(--oc-colors-text-subtext1);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .oc-search-result__url {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--oc-colors-text-subtext1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
