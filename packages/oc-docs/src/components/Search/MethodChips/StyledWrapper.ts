import styled from '@emotion/styled';

/**
 * Row of method filter toggles (GET/POST/PUT/DEL). Inactive chips are neutral;
 * an active chip adopts its method colour via the `--chip-color` custom property
 * set inline from getMethodColorVar (so the colour stays a theme token).
 */
export const ChipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  .oc-method-chip {
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    height: 28px;
    padding: 0 10px;
    cursor: pointer;
    color: var(--oc-colors-text-muted);
    background: transparent;
    border: 1px solid var(--oc-border-border1);
    border-radius: 6px;
    transition: border-color 0.12s ease, color 0.12s ease, background 0.12s ease;
  }

  .oc-method-chip:hover {
    border-color: var(--oc-border-border2);
    color: var(--oc-text);
  }

  .oc-method-chip[aria-pressed='true'] {
    color: var(--chip-color);
    border-color: var(--chip-color);
    background: color-mix(in srgb, var(--chip-color) 8%, transparent);
  }

  .oc-method-chip:focus-visible {
    outline: 2px solid var(--oc-accents-primary);
    outline-offset: 1px;
  }
`;
