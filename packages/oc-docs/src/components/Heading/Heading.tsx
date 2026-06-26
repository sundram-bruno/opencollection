import React from 'react';
import { StyledWrapper } from './StyledWrapper';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps {
  children: React.ReactNode;
  /** Semantic heading element to render (the visual style is the same). Defaults to "h1". */
  as?: HeadingLevel;
  className?: string;
  'data-testid'?: string;
}

/**
 * Reusable heading with the shared title typography
 * (Inter, Semi Bold 600, 20px, 100% line-height, -0.5px letter-spacing).
 * Use `as` to render the correct heading level for the document outline.
 */
export const Heading: React.FC<HeadingProps> = ({ children, as = 'h1', className, 'data-testid': testId }) => (
  <StyledWrapper as={as} className={className} data-testid={testId}>
    {children}
  </StyledWrapper>
);

export default Heading;
