import styled from '@emotion/styled';

/**
 * A single search result row: method badge + name + breadcrumb on the first
 * line, request URL on the second. Full-width button so the whole row is one
 * click/tap target. Theme tokens throughout.
 */
export const ResultButton = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  cursor: pointer;
  text-align: left;
  background: transparent;
  border: 0;
  border-radius: var(--oc-border-radius-md);
  font-family: var(--font-sans);

  &:hover,
  &[data-active='true'] {
    background: var(--oc-background-surface1);
  }

  &:focus-visible {
    outline: 2px solid var(--oc-accents-primary);
    outline-offset: -2px;
  }

  .oc-search-result__badge {
    margin-top: 2px;
  }

  .oc-search-result__body {
    min-width: 0;
    flex: 1 1 auto;
  }

  .oc-search-result__title-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
  }

  .oc-search-result__name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--oc-text);
  }

  .oc-search-result__breadcrumb {
    font-size: 0.75rem;
    color: var(--oc-colors-text-muted);
  }

  .oc-search-result__url {
    margin-top: 2px;
    font-size: 0.8125rem;
    color: var(--oc-colors-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
