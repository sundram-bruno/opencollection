import styled from '@emotion/styled';

/**
 * Three-region app layout (BRU-3188): Topbar (top) + a row of Sidebar (left)
 * and the routed Content (right). Column fills the viewport; only the content
 * region scrolls. Emotion + theme tokens, no hardcoded hex.
 *
 * The sidebar region is hidden below the tablet breakpoint until BRU-3574 adds
 * the off-canvas drawer; navigation there is via breadcrumb + prev/next.
 */
export const AppShellWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  .oc-appshell__row {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  .oc-appshell__sidebar {
    width: var(--sidebar-width);
    flex-shrink: 0;
    height: 100%;
    overflow: hidden;
    border-right: 1px solid var(--oc-border-border1, var(--border-color));
    background-color: var(--oc-sidebar-bg);
  }

  .oc-appshell__content {
    flex: 1;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
  }

  @media (max-width: 768px) {
    .oc-appshell__sidebar {
      display: none;
    }
  }
`;
