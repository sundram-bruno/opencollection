import styled from '@emotion/styled';

/**
 * Method filter toggles (GET/POST/PUT/DEL) — matches the Claude Design spec:
 * mono, uppercase, an outline that adopts the method colour when active (no
 * fill). The colour comes from getMethodColorVar via the inline `--chip-color`.
 */
export const ChipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;

  .oc-method-chip {
    font-family: var(--font-mono);
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 3px 9px;
    cursor: pointer;
    color: var(--oc-colors-text-subtext1);
    background: transparent;
    border: 1px solid var(--oc-border-border2);
    border-radius: 5px;
    transition: border-color 0.12s ease, color 0.12s ease;
  }

  .oc-method-chip:hover {
    color: var(--oc-text);
  }

  .oc-method-chip[aria-pressed='true'] {
    color: var(--chip-color);
    border-color: var(--chip-color);
  }

  .oc-method-chip:focus-visible {
    outline: 2px solid var(--oc-accents-primary);
    outline-offset: 1px;
  }
`;
