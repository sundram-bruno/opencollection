import React from 'react';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import { StyledWrapper } from './StyledWrapper';

interface SectionProps {
  /** Heading shown above the content (rendered through `SectionLabel`). */
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  labelTestId?: string;
}

/**
 * A labelled content section: a `SectionLabel` heading followed by its content.
 * Owns the spacing between consecutive sections, so callers can stack them
 * without managing margins. Reusable across pages.
 */
export const Section: React.FC<SectionProps> = ({ label, children, className, labelTestId }) => (
  <StyledWrapper className={className}>
    <SectionLabel testId={labelTestId}>{label}</SectionLabel>
    {children}
  </StyledWrapper>
);

export default Section;
