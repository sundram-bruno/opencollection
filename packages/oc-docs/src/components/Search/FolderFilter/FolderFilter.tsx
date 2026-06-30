import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronDownIcon, FolderIcon } from '../../../assets/icons';
import type { FolderOption } from '../searchIndex';
import { StyledWrapper } from './StyledWrapper';

interface FolderFilterProps {
  folders: FolderOption[];
  /** Slug of the selected folder, or null when no folder filter is active. */
  value: string | null;
  onChange: (slug: string | null) => void;
  testId?: string;
}

/** Folder filter dropdown for the search palette. Local to the palette, never
 * written to the shared search slice. Renders nothing when the collection has
 * no folders. */
export const FolderFilter: React.FC<FolderFilterProps> = ({
  folders,
  value,
  onChange,
  testId = 'search-folder-filter',
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation(); // close the menu, not the whole palette
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  if (folders.length === 0) return null;

  const selected = folders.find((f) => f.slug === value) || null;

  const choose = (slug: string) => {
    onChange(slug === value ? null : slug); // re-selecting clears
    setOpen(false);
  };

  return (
    <StyledWrapper ref={wrapperRef} data-testid={testId}>
      <button
        type="button"
        className={`folder-filter-button${selected ? ' is-active' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((p) => !p)}
      >
        {selected ? selected.name : 'Folder'}
        <span className="folder-filter-chevron">
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <ul id={menuId} className="folder-filter-menu" role="listbox" aria-label="Filter by folder">
          {folders.map((folder) => (
            <li key={folder.slug} role="option" aria-selected={folder.slug === value}>
              <button
                type="button"
                className={`folder-filter-option${folder.slug === value ? ' is-selected' : ''}`}
                onClick={() => choose(folder.slug)}
              >
                <FolderIcon />
                <span className="folder-filter-label">{folder.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </StyledWrapper>
  );
};

export default FolderFilter;
