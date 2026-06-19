import styled from '@emotion/styled';

/**
 * Page shell. Mirrors the Claude design's page-request wrapper (page-request.jsx):
 * a centered 1280px column with 40/48 padding, so content AND the prev/next
 * footer share one box and stay aligned + centered on wide screens. Also a
 * full-height flex column so the footer pins to the bottom on short pages and
 * flows/scrolls on tall ones (`min-height: 100%` fills the AppShell content
 * region, which is `height: 100%`).
 */
export const PageRouterWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 48px;

  @media (max-width: 1024px) {
    padding: 32px 28px;
  }
  @media (max-width: 768px) {
    padding: 24px 18px;
  }

  .oc-page__body {
    flex: 1 0 auto;
  }
`;
