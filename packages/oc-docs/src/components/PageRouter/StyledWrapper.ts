import styled from '@emotion/styled';

/**
 * Page shell: a full-height flex column so the prev/next footer is pinned to
 * the bottom of the scroll viewport when content is short, and flows naturally
 * (scrolls) when content is tall. `min-height: 100%` fills the AppShell content
 * region (which is `height: 100%`).
 */
export const PageRouterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;

  .oc-page__body {
    flex: 1 0 auto;
  }
`;
