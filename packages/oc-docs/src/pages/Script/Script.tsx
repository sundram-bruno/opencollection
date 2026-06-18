import React from 'react';
import type { PageProps } from '../../routing/types';
import { PageWrapper } from '../../components/PageWrapper';
import { EmptyState } from '../../components/EmptyState';
import { BookIcon } from '../../assets/icons';

/**
 * Script page (BRU-3188 scaffold). Slot only — nothing in the schema routes to
 * a standalone script node yet (scripts render inside the request page). The
 * 'script' PageType + this page exist so a future script-only nav entry has a
 * home without touching the router.
 */
export const Script: React.FC<PageProps> = ({ node }) => (
  <PageWrapper>
    <EmptyState
      icon={<BookIcon />}
      heading={node.name}
      subheading="Scripts are documented inside their request page."
    />
  </PageWrapper>
);

export default Script;
