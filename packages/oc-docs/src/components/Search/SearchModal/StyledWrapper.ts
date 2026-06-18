import styled from '@emotion/styled';

/** Full-viewport dimmed backdrop; centers the palette near the top. */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10vh 16px 16px;
  box-sizing: border-box;
  background: color-mix(in srgb, var(--oc-background-crust) 60%, transparent);

  @media (max-width: 640px) {
    padding: 0;
  }
`;

/** The palette card. */
export const ModalCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 720px;
  max-height: 70vh;
  overflow: hidden;
  background: var(--oc-background-base);
  border: 1px solid var(--oc-border-border1);
  border-radius: var(--oc-border-radius-lg);
  box-shadow: var(--oc-dropdown-shadow);
  font-family: var(--font-sans);

  /* Full-screen sheet on phones (no dedicated mobile design — desktop language,
     scaled to a sheet). */
  @media (max-width: 640px) {
    max-width: none;
    max-height: none;
    height: 100%;
    border: 0;
    border-radius: 0;
  }

  .oc-search__inputrow {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--oc-border-border1);
  }

  .oc-search__inputrow > svg {
    flex-shrink: 0;
    color: var(--oc-colors-text-muted);
  }

  .oc-search__input {
    flex: 1 1 auto;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    font-family: var(--font-sans);
    font-size: 1rem;
    color: var(--oc-text);
  }
  .oc-search__input::placeholder {
    color: var(--oc-colors-text-muted);
  }

  .oc-search__filters {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 12px 16px;
    border-bottom: 1px solid var(--oc-border-border1);
  }

  .oc-search__clear {
    margin-left: auto;
    padding: 4px 6px;
    cursor: pointer;
    background: transparent;
    border: 0;
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    color: var(--oc-colors-text-muted);
  }
  .oc-search__clear:hover {
    color: var(--oc-accents-primary);
  }

  .oc-search__results {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 8px;
  }

  .oc-search__list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* The reused EmptyState card has a dashed border + min-height that suit a
     standalone section; inside the palette we want it borderless and centered. */
  .oc-search__empty {
    border: 0;
    min-height: 14rem;
  }
`;
