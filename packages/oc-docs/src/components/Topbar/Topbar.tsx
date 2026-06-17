import React, { useEffect, useState } from 'react';
import { StyledWrapper } from './StyledWrapper';
import Brand from './Brand';
import OpenInBrunoButton from './OpenInBrunoButton';
import MobileOverflow from './MobileOverflow';
import { SearchIcon, HamburgerIcon, IconButton } from './icons';
import { useTopbarLayout, showsHamburger } from './useTopbarLayout';

export interface TopbarProps {
  collectionName: string;
  version?: string;
  logo?: React.ReactNode;
  /** PRIMARY control, filled by BRU-3573. Rendered as-is; degrades when absent. */
  searchSlot?: React.ReactNode;
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
 * Below desktop the search collapses to an icon that expands a full-width row,
 * and Open-in-Bruno is hidden (the Bruno desktop app only runs on desktop).
 *
 * Note: `version` is accepted for cross-lane contract stability but is not
 * rendered in the header — the version is shown in the page body.
 */
const Topbar: React.FC<TopbarProps> = ({
  collectionName,
  logo,
  searchSlot,
  envSwitcherSlot,
  onOpenInBruno,
  openInBrunoHref,
  onToggleSidebar,
}) => {
  const mode = useTopbarLayout();
  const [searchOpen, setSearchOpen] = useState(false);

  const isMobile = mode === 'mobile';
  const isDesktop = mode === 'desktop';
  const hasSearch = searchSlot != null;
  const hasSecondary = envSwitcherSlot != null;
  const hasCta = openInBrunoHref != null || onOpenInBruno != null;

  // Collapse the revealed search row when entering the desktop layout, so it
  // doesn't reappear (with stale aria state) the next time search collapses.
  useEffect(() => {
    if (isDesktop) setSearchOpen(false);
  }, [isDesktop]);

  const searchInner = <div className="oc-topbar__search-inner">{searchSlot}</div>;

  return (
    <StyledWrapper className="oc-topbar" data-mode={mode}>
      <div className="oc-topbar__bar">
        {showsHamburger(mode) && (
          <IconButton label="Toggle sidebar" onClick={onToggleSidebar}>
            <HamburgerIcon />
          </IconButton>
        )}

        <Brand collectionName={collectionName} logo={logo} />

        {/* Flex-1 middle: inline search on desktop, else a spacer that keeps the
            right-hand controls pinned to the right edge (search collapses to an
            icon below desktop, and may be empty). */}
        {hasSearch && isDesktop ? (
          <div className="oc-topbar__search">{searchInner}</div>
        ) : (
          <div className="oc-topbar__spacer" />
        )}

        {/* Below desktop: search toggle reveals the full-width search row below. */}
        {hasSearch && !isDesktop && (
          <IconButton
            label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((prev) => !prev)}
          >
            <SearchIcon />
          </IconButton>
        )}

        {/* Secondary controls: inline on tablet/desktop, overflow popover on mobile. */}
        {hasSecondary && !isMobile && (
          <div className="oc-topbar__secondary">{envSwitcherSlot}</div>
        )}
        {hasSecondary && isMobile && <MobileOverflow>{envSwitcherSlot}</MobileOverflow>}

        {/* Open-in-Bruno is desktop-only — the Bruno desktop app isn't on tablet/mobile. */}
        {isDesktop && hasCta && (
          <OpenInBrunoButton href={openInBrunoHref} onClick={onOpenInBruno} />
        )}
      </div>

      {hasSearch && !isDesktop && searchOpen && (
        <div className="oc-topbar__search-row">{searchInner}</div>
      )}
    </StyledWrapper>
  );
};

export default Topbar;
