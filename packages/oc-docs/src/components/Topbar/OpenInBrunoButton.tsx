import React from 'react';
import styled from '@emotion/styled';
import { BrunoGlyph } from './icons';

export interface OpenInBrunoButtonProps {
  /** When provided, renders a real `bruno://` deep link (`<a href>`). */
  href?: string;
  /** Click handler; used when no href is given (renders a `<button>`). */
  onClick?: () => void;
  /** Collapse to a square icon-only control (tablet / mobile). */
  iconOnly?: boolean;
  label?: string;
}

const Base = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  box-sizing: border-box;
  font-family: var(--font-sans);
  font-size: var(--oc-font-size-sm);
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  color: var(--oc-brand);
  background: var(--oc-background-base);
  border: 1px solid var(--oc-brand);
  border-radius: var(--oc-border-radius-base);
  transition: background-color 0.12s ease, opacity 0.12s ease;

  svg {
    width: 16px;
    height: 16px;
    flex: none;
  }

  &:hover {
    background: color-mix(in srgb, var(--oc-brand) 8%, var(--oc-background-base));
  }

  &.is-full {
    padding: 5px 10px;
  }

  &.is-icon {
    width: 28px;
    padding: 0;
  }
`;

const OpenInBrunoButton: React.FC<OpenInBrunoButtonProps> = ({
  href,
  onClick,
  iconOnly = false,
  label = 'Open in Bruno',
}) => {
  const className = iconOnly ? 'is-icon' : 'is-full';
  const ariaLabel = iconOnly ? label : undefined;

  const content = (
    <>
      <BrunoGlyph />
      {!iconOnly && <span>{label}</span>}
    </>
  );

  if (href) {
    return (
      <Base
        as="a"
        className={className}
        href={href}
        aria-label={ariaLabel}
        title={label}
        data-testid="open-in-bruno"
      >
        {content}
      </Base>
    );
  }

  return (
    <Base
      as="button"
      type="button"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      title={label}
      data-testid="open-in-bruno"
    >
      {content}
    </Base>
  );
};

export default OpenInBrunoButton;
