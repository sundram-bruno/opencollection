import React, { useEffect, useRef, useState } from 'react';
import { OverflowIcon } from '../../../assets/icons';
import IconButton from '../../../ui/IconButton/IconButton';
import { StyledWrapper } from './StyledWrapper';

export interface MobileOverflowProps {
  children: React.ReactNode;
}

const MobileOverflow: React.FC<MobileOverflowProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <StyledWrapper className="topbar-overflow" ref={containerRef}>
      <IconButton
        label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <OverflowIcon />
      </IconButton>
      {open && (
        <div className="topbar-overflow-popover" role="menu">
          {children}
        </div>
      )}
    </StyledWrapper>
  );
};

export default MobileOverflow;
