import React from 'react';
import type { PageProps } from '../../routing/types';
import { PageWrapper } from '../../components/PageWrapper';
import { EmptyState } from '../../components/EmptyState';
import { GlobeIcon } from '../../assets/icons';

/**
 * Environments page (BRU-3188 scaffold). The rich environments view is owned by
 * BRU-2548; until then this routes to a graceful empty state.
 */
export const Environments: React.FC<PageProps> = () => (
  <PageWrapper>
    <EmptyState
      icon={<GlobeIcon />}
      heading="Environments"
      subheading="The environments view is coming soon (BRU-2548)."
    />
  </PageWrapper>
);

export default Environments;
