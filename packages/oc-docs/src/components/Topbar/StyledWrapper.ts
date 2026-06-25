import styled from '@emotion/styled';

/**
 * Topbar bar styling. Square bar (radius 0, bottom border only). Color surfaces
 * map to `--oc-*` theme tokens so the bar honors light/dark automatically.
 *
 * Which controls render per breakpoint is decided in JSX (`Topbar` +
 * `useTopbarLayout`), not via CSS. `data-mode` (mobile | tablet | desktop) is
 * exposed on the host element for debugging and e2e targeting. Brand, icon
 * buttons and the overflow popover own their own styles in their components.
 */
export const StyledWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-sans);
  background: var(--oc-background-base);
  border-bottom: 1px solid var(--oc-border-border1);

  .topbar-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 51px;
    padding: 0 20px;
    box-sizing: border-box;
  }

  /* Mobile tightens the horizontal inset + gap (matches design). */
  &[data-mode='mobile'] .topbar-bar {
    gap: 8px;
    padding: 0 12px;
  }

  /* Pull the hamburger toward the edge so the brand isn't over-indented. */
  .topbar-menu {
    margin-left: -4px;
  }

  .topbar-search {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    justify-content: center;
  }

  .topbar-search-inner {
    width: 100%;
    max-width: 440px;
  }

  .topbar-secondary {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .topbar-spacer {
    flex: 1 1 auto;
  }

  /* Search row revealed under the bar when the icon is toggled (below desktop). */
  .topbar-search-row {
    display: flex;
    align-items: center;
    padding: 0 20px 10px;
    box-sizing: border-box;

    .topbar-search-inner {
      max-width: none;
    }
  }
`;
