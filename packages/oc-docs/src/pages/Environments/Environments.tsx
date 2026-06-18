import React from 'react';
import type { PageProps } from '../../routing/types';
import { PageWrapper } from '../../components/PageWrapper';
import EnvironmentsView from '../../components/PlaygroundDrawer/DrawerContent/Views/EnvironmentsView/EnvironmentsView';

/**
 * Environments page (BRU-3188 bridge). Reuses the existing EnvironmentsView as-is
 * so the page renders real content now; BRU-2548 swaps in the redesigned body
 * here (~1 line). Thin wrapper — no new env logic.
 */
export const Environments: React.FC<PageProps> = ({ collection }) => (
  <PageWrapper>
    <EnvironmentsView collection={collection} />
  </PageWrapper>
);

export default Environments;
