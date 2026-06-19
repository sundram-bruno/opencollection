import styled from '@emotion/styled';

/**
 * Prev/Next pagination footer. Emotion + theme tokens (no hardcoded hex) so it
 * honours light/dark. Mirrors the shared PageWrapper gutters so it lines up
 * with page content. Two equal halves: Previous (left) and Next (right).
 */
export const PrevNextWrapper = styled.nav`
  display: flex;
  align-items: stretch;
  gap: 16px;
  /* Claude design (doc-ui.jsx Pagination): top divider + 28px gap to the cards. */
  padding: 28px 3.5rem 20px;
  border-top: 1px solid var(--oc-border-border1, var(--border-color));

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    padding: 20px 1.25rem 20px;
  }

  .oc-prevnext__half {
    display: flex;
    flex: 1;
    min-width: 0;
  }
  .oc-prevnext__half--next {
    justify-content: flex-end;
  }

  .oc-prevnext__card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    /* Figma: fixed 65px tall, 14/18 padding, 8px radius (node 3990-10821). */
    min-height: 65px;
    padding: 14px 18px;
    border-radius: 8px;
    border: 1px solid var(--oc-border-border1, var(--border-color));
    text-decoration: none;
    transition: border-color 0.12s ease, background-color 0.12s ease;
  }
  .oc-prevnext__card:hover {
    border-color: var(--oc-colors-accent, var(--text-secondary));
    background-color: color-mix(in srgb, var(--oc-text) 3%, transparent);
  }
  .oc-prevnext__card--next {
    align-items: flex-end;
    text-align: right;
  }

  .oc-prevnext__label {
    font-size: 0.7rem;
    line-height: 1.2;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--oc-text-muted, var(--text-secondary));
  }
  .oc-prevnext__name {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    line-height: 1.2;
    font-weight: 600;
    color: var(--oc-text-primary, var(--text-primary));
  }
  .oc-prevnext__method {
    font-size: 0.7rem;
    font-weight: 700;
  }
`;
