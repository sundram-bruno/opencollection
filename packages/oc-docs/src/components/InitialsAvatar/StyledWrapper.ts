import styled from '@emotion/styled';

export const StyledWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: var(--oc-border-radius-base);
  background: linear-gradient(135deg, var(--oc-brand), var(--oc-primary-subtle));
  color: var(--oc-button2-color-primary-text);
  font-family: var(--font-sans);
  font-size: var(--oc-font-size-xs);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
  user-select: none;
`;
