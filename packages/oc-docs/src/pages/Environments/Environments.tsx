import React from 'react';
import type { PageProps } from '../../routing/types';
import { PageWrapper } from '../../components/PageWrapper';
import EnvironmentsView from '../../components/PlaygroundDrawer/DrawerContent/Views/EnvironmentsView/EnvironmentsView';

// Thin wrapper — reuses EnvironmentsView as the page body.
export const Environments: React.FC<PageProps> = ({ collection }) => (
  <PageWrapper>
    <EnvironmentsView collection={collection} />
  </PageWrapper>
);

export default Environments;
