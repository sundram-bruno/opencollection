import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, FolderIcon } from '../../../assets/icons';
import type { FolderOption } from '../../../utils/searchIndex';
import { FilterWrapper } from './StyledWrapper';

export interface FolderFilterProps {
  folders: FolderOption[];
  /** Slug of the selected folder, or null when no folder filter is active. */
  value: string | null;
  onChange: (slug: string | null) => void;
}

/** Folder filter dropdown for the search palette. Local to the modal — never
 * written to the shared search slice. Renders nothing when the collection has
 * no folders. */
export const FolderFilter: React.FC<FolderFilterProps> = ({ folders, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
    <FilterWrapper ref={wrapperRef}>
      <button
        type="button"
        className={`oc-folder-filter__button${selected ? ' is-active' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
      >
        {selected ? selected.name : 'Folder'}
        <span className="oc-folder-filter__chevron">
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <ul className="oc-folder-filter__menu" role="listbox" aria-label="Filter by folder">
          {folders.map((folder) => (
            <li key={folder.slug} role="option" aria-selected={folder.slug === value}>
              <button
                type="button"
                className={`oc-folder-filter__option${folder.slug === value ? ' is-selected' : ''}`}
                onClick={() => choose(folder.slug)}
              >
                <FolderIcon />
                {folder.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </FilterWrapper>
  );
};

export default FolderFilter;
