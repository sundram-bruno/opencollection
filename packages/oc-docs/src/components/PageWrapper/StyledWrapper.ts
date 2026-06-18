import styled from '@emotion/styled';

/**
 * Shared page padding: 15px top/bottom (0.9375rem) with 56px (3.5rem) left/right
 * gutters on desktop, tightened to 20px (1.25rem) on small screens so content
 * stays readable without horizontal overflow. In rems so it scales with the
 * root font size. Every page renders inside this, so the responsive gutters
 * apply consistently across the app.
 */
export const PageWrapperContainer = styled.div`
  padding: 0.9375rem 3.5rem;

  @media (max-width: 768px) {
    padding: 0.9375rem 1.25rem;
  }
`;
