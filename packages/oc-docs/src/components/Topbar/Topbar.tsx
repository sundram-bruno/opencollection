import React, { useEffect, useState } from 'react';
import { StyledWrapper } from './StyledWrapper';
import Brand from './Brand/Brand';
import MobileOverflow from './MobileOverflow/MobileOverflow';
import OpenInBrunoButton from '../OpenInBrunoButton/OpenInBrunoButton';
import IconButton from '../../ui/IconButton/IconButton';
import { SearchIcon, HamburgerIcon } from '../../assets/icons';
import { useTopbarLayout, showsHamburger } from '../../hooks/useTopbarLayout';
import { useCanRunBrunoApp } from '../../hooks/useCanRunBrunoApp';

export interface TopbarProps {
  collectionName: string;
  version?: string;
  logo?: React.ReactNode;
  searchSlot?: React.ReactNode;
  envSwitcherSlot?: React.ReactNode;
  onOpenInBruno?: () => void;
  /** Optional `bruno://` deep link; when set the CTA renders as a real anchor. */
  openInBrunoHref?: string;
  /** Invoked by the mobile hamburger. */
  onToggleSidebar?: () => void;
  testId?: string;
}

const Topbar: React.FC<TopbarProps> = ({
  collectionName,
  version,
  logo,
  searchSlot,
  envSwitcherSlot,
  onOpenInBruno,
  openInBrunoHref,
  onToggleSidebar,
  testId = 'topbar',
}) => {
  const mode = useTopbarLayout();
  const canRunBrunoApp = useCanRunBrunoApp();
  const [searchOpen, setSearchOpen] = useState(false);

  const isMobile = mode === 'mobile';
  const isDesktop = mode === 'desktop';
  const hasSearch = searchSlot != null;
  const hasSecondary = envSwitcherSlot != null;
  const hasCta = openInBrunoHref != null || onOpenInBruno != null;

  // Collapse the revealed search row when re-entering desktop so stale aria state is cleared.
  useEffect(() => {
    if (isDesktop) setSearchOpen(false);
  }, [isDesktop]);

  const searchInner = <div className="topbar-search-inner">{searchSlot}</div>;

  return (
    <StyledWrapper data-mode={mode} data-testid={testId}>
      <div className="topbar-bar">
        {showsHamburger(mode) && (
          <IconButton label="Toggle sidebar" onClick={onToggleSidebar}>
            <HamburgerIcon />
          </IconButton>
        )}

        <Brand collectionName={collectionName} version={version} logo={logo} compact={isMobile} />

        {hasSearch && isDesktop ? (
          <div className="topbar-search">{searchInner}</div>
        ) : (
          <div className="topbar-spacer" />
        )}

        {hasSearch && !isDesktop && (
          <IconButton
            label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((prev) => !prev)}
          >
            <SearchIcon />
          </IconButton>
        )}

        {hasSecondary && !isMobile && (
          <div className="topbar-secondary">{envSwitcherSlot}</div>
        )}
        {hasSecondary && isMobile && <MobileOverflow>{envSwitcherSlot}</MobileOverflow>}

        {isDesktop && canRunBrunoApp && hasCta && (
          <OpenInBrunoButton href={openInBrunoHref} onClick={onOpenInBruno} />
        )}
      </div>

      {hasSearch && !isDesktop && searchOpen && (
        <div className="topbar-search-row">{searchInner}</div>
      )}
    </StyledWrapper>
  );
};

export default Topbar;
