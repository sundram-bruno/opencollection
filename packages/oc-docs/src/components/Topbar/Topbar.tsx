import React, { useCallback, useEffect, useState } from 'react';
import { StyledWrapper } from './StyledWrapper';
import Brand from './Brand';
import MobileOverflow from './MobileOverflow';
import { OpenInBrunoButton } from '../OpenInBrunoButton';
import { IconButton } from '../IconButton';
import { SearchIcon, HamburgerIcon } from '../../assets/icons';
import { useTopbarLayout, showsHamburger } from '../../hooks/useTopbarLayout';
import { useCanRunBrunoApp } from '../../hooks/useCanRunBrunoApp';

export interface TopbarProps {
  collectionName: string;
  version?: string;
  logo?: React.ReactNode;
  /** PRIMARY control, filled by BRU-3573. Rendered as-is; degrades when absent. */
  searchSlot?: React.ReactNode;
  /**
   * Below-desktop search-row open state. Optional: when provided (with
   * `onSearchOpenChange`) the row is controlled by the parent so the search
   * affordance can share one state with its slot content (BRU-3573); when
   * omitted the Topbar manages it internally (backward compatible).
   */
  searchOpen?: boolean;
  onSearchOpenChange?: (open: boolean) => void;
  /** SECONDARY controls (env switcher + show-vars), filled by BRU-3186. */
  envSwitcherSlot?: React.ReactNode;
  onOpenInBruno?: () => void;
  /** Optional `bruno://` deep link; when set the CTA renders as a real anchor. */
  openInBrunoHref?: string;
  /** Invoked by the mobile hamburger; the drawer itself is BRU-3574. */
  onToggleSidebar?: () => void;
}

/**
 * Sticky, purely-presentational top navigation bar.
 *
 * No routing, data fetching, or store access — everything arrives via props.
 * Composes small reusable subcomponents and exposes two slots (search,
 * env-switcher) that render whatever node is passed and degrade gracefully
 * when empty. Responsive layout:
 * - desktop (>=1024): full bar — brand · centered search · env switcher · Open-in-Bruno.
 * - tablet (768-1023): hamburger · brand · search icon · env switcher inline (no CTA).
 * - mobile (<768): hamburger · brand · search icon · overflow popover (env) (no CTA).
 * Below desktop the search collapses to an icon that expands a full-width row.
 *
 * Open-in-Bruno needs the desktop *layout* (>=1024) AND a device that can run
 * the Bruno desktop app (capability check) — so a large touch tablet like the
 * iPad Pro (1024–1366px) gets the desktop layout but no CTA.
 */
const Topbar: React.FC<TopbarProps> = ({
  collectionName,
  version,
  logo,
  searchSlot,
  searchOpen: controlledSearchOpen,
  onSearchOpenChange,
  envSwitcherSlot,
  onOpenInBruno,
  openInBrunoHref,
  onToggleSidebar,
}) => {
  const mode = useTopbarLayout();
  const canRunBrunoApp = useCanRunBrunoApp();
  const [internalSearchOpen, setInternalSearchOpen] = useState(false);
  const isControlled = controlledSearchOpen !== undefined;
  const searchOpen = isControlled ? controlledSearchOpen : internalSearchOpen;
  const setSearchOpen = useCallback(
    (next: boolean) => {
      if (onSearchOpenChange) onSearchOpenChange(next);
      if (!isControlled) setInternalSearchOpen(next);
    },
    [onSearchOpenChange, isControlled],
  );

  const isMobile = mode === 'mobile';
  const isDesktop = mode === 'desktop';
  const hasSearch = searchSlot != null;
  const hasSecondary = envSwitcherSlot != null;
  const hasCta = openInBrunoHref != null || onOpenInBruno != null;

  // Search collapses to a mobile-only icon+row; inline on tablet/desktop. When
  // leaving the mobile layout, close it so no stale open state lingers.
  useEffect(() => {
    if (!isMobile) setSearchOpen(false);
  }, [isMobile, setSearchOpen]);

  const searchInner = <div className="oc-topbar__search-inner">{searchSlot}</div>;

  return (
    <StyledWrapper className="oc-topbar" data-mode={mode}>
      <div className="oc-topbar__bar">
        {showsHamburger(mode) && (
          <IconButton label="Toggle sidebar" onClick={onToggleSidebar}>
            <HamburgerIcon />
          </IconButton>
        )}

        <Brand collectionName={collectionName} version={version} logo={logo} compact={isMobile} />

        {/* Flex-1 middle: inline search on tablet + desktop; on mobile it collapses
            to an icon and a spacer keeps the right-hand controls pinned right. */}
        {hasSearch && !isMobile ? (
          <div className="oc-topbar__search">{searchInner}</div>
        ) : (
          <div className="oc-topbar__spacer" />
        )}

        {/* Mobile only: search toggle reveals the full-width search row below. */}
        {hasSearch && isMobile && (
          <IconButton
            label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <SearchIcon />
          </IconButton>
        )}

        {/* Secondary controls: inline on tablet/desktop, overflow popover on mobile. */}
        {hasSecondary && !isMobile && (
          <div className="oc-topbar__secondary">{envSwitcherSlot}</div>
        )}
        {hasSecondary && isMobile && <MobileOverflow>{envSwitcherSlot}</MobileOverflow>}

        {/* Open-in-Bruno: desktop layout AND a device that can run Bruno desktop
            (hidden on large touch tablets like iPad Pro despite their width). */}
        {isDesktop && canRunBrunoApp && hasCta && (
          <OpenInBrunoButton href={openInBrunoHref} onClick={onOpenInBruno} />
        )}
      </div>

      {hasSearch && isMobile && searchOpen && (
        <div className="oc-topbar__search-row">{searchInner}</div>
      )}
    </StyledWrapper>
  );
};

export default Topbar;
