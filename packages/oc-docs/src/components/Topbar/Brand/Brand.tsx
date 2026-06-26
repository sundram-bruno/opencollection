import React from 'react';
import InitialsAvatar from '../../InitialsAvatar/InitialsAvatar';
import { StyledWrapper } from './StyledWrapper';

export interface BrandProps {
  collectionName: string;
  version?: string;
  logo?: React.ReactNode;
  /**
   * Compact (mobile) brand: avatar + a fixed "Docs" label, with the collection
   * name and version hidden.
   */
  compact?: boolean;
  /** Root test id; the name/version derive from it (`${testId}-name` etc.). */
  testId?: string;
}

const PRODUCT_LABEL = 'Docs';

const renderLogo = (logo: React.ReactNode, collectionName: string): React.ReactNode => {
  if (typeof logo === 'string') {
    return <img src={logo} alt={`${collectionName} logo`} />;
  }
  return logo;
};

const formatVersion = (version: string): string => {
  const trimmed = version.trim();
  return /^v/i.test(trimmed) ? trimmed : `v${trimmed}`;
};

const Brand: React.FC<BrandProps> = ({
  collectionName,
  version,
  logo,
  compact = false,
  testId = 'brand',
}) => {
  const hasLogo = logo != null && logo !== '';
  return (
    <StyledWrapper className="topbar-brand" data-testid={testId}>
      <span className="topbar-brand-logo">
        {hasLogo ? renderLogo(logo, collectionName) : <InitialsAvatar collectionName={collectionName} />}
      </span>
      {compact ? (
        <span className="topbar-brand-name" data-testid={`${testId}-name`}>{PRODUCT_LABEL}</span>
      ) : (
        <span className="topbar-brand-text">
          <span className="topbar-brand-name" data-testid={`${testId}-name`} title={collectionName}>
            {collectionName}
          </span>
          {version && (
            <span className="topbar-brand-version" data-testid={`${testId}-version`}>
              {formatVersion(version)}
            </span>
          )}
        </span>
      )}
    </StyledWrapper>
  );
};

export default Brand;
