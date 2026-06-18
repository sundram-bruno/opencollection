import styled from '@emotion/styled';

/**
 * The search affordance shown in the Topbar's searchSlot: an input-styled pill
 * that opens the search palette. Not a real input — a button — so the palette
 * (a dialog) owns the actual text field. Tokens keep it theme-aware.
 */
export const TriggerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 36px;
  padding: 0 12px;
  box-sizing: border-box;
  cursor: text;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  color: var(--oc-colors-text-muted);
  background: var(--oc-background-surface0);
  border: 1px solid var(--oc-border-border1);
  border-radius: var(--oc-border-radius-md);
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: var(--oc-border-border2);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--oc-accents-primary);
  }

  svg {
    flex-shrink: 0;
    color: var(--oc-colors-text-muted);
  }

  .oc-search-trigger__label {
    flex: 1 1 auto;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
