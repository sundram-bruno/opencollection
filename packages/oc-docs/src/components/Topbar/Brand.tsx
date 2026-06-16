import React from 'react';

export interface BrandProps {
  collectionName: string;
  version?: string;
  logo?: React.ReactNode;
}

/**
 * Renders an arbitrary logo node. A string is treated as an image src so
 * callers can pass a URL (as `OpenCollection` does today); any other node is
 * rendered verbatim.
 */
const renderLogo = (logo: React.ReactNode, collectionName: string): React.ReactNode => {
  if (typeof logo === 'string') {
    return <img src={logo} alt={`${collectionName} logo`} />;
  }
  return logo;
};

const Brand: React.FC<BrandProps> = ({ collectionName, version, logo }) => (
  <div className="oc-topbar__brand">
    {logo != null && logo !== '' && (
      <span className="oc-topbar__brand-logo">{renderLogo(logo, collectionName)}</span>
    )}
    <span className="oc-topbar__brand-text">
      <span className="oc-topbar__brand-name" title={collectionName}>
        {collectionName}
      </span>
      {version && <span className="oc-topbar__brand-version">{version}</span>}
    </span>
  </div>
);

export default Brand;
