import React from 'react';
import { StyledWrapper } from './StyledWrapper';

interface MethodProps {
  method: string;
  className?: string;
  /**
   * Visual variant. `default` is the sidebar/prev-next badge. `search` matches
   * the Claude Design search-result badge (mono, larger radius/size) — same
   * method colours, different geometry; opt-in so existing usages are unchanged.
   */
  variant?: 'default' | 'search';
}

export const Method: React.FC<MethodProps> = ({ method, className = '', variant = 'default' }) => {
  const normalizedMethod = method?.toLowerCase() || 'get';
  const displayMethod = method?.toUpperCase() === 'DELETE' ? 'DEL' : method?.toUpperCase() || 'GET';

  return (
    <StyledWrapper className={`${normalizedMethod} ${className}`} data-variant={variant}>
      {displayMethod}
    </StyledWrapper>
  );
};

export default Method;
