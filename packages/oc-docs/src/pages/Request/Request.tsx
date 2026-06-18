import React from 'react';
import { useNavigate } from 'react-router-dom';
import Item from '../../components/Docs/Item/Item';
import type { PageProps } from '../../routing/types';
import { OVERVIEW_SLUG } from '../../routing/navModel';

/**
 * Documentation page for a request or folder node (BRU-3188). Reuses the
 * existing `Item` renderer as the body until BRU-3569's section library
 * replaces it. `Item` draws its own breadcrumb + title + body, so this page
 * only feeds it data and wires its callbacks to routing.
 *
 * Breadcrumb segments carry the target slug in the `uuid` field, so
 * `onBreadcrumbClick` can navigate directly without a uuid→slug lookup.
 */
export const Request: React.FC<PageProps> = ({ node, collection, onOpenPlayground }) => {
  const navigate = useNavigate();
  const collectionName = collection?.info?.name || 'Overview';

  const breadcrumb = [
    { name: collectionName, uuid: OVERVIEW_SLUG },
    ...node.ancestors.map((a) => ({ name: a.name, uuid: a.slug })),
  ];

  return (
    <Item
      item={node.item}
      collection={collection}
      breadcrumb={breadcrumb}
      onBreadcrumbClick={(slug: string) => navigate(`/${slug}`)}
      onTryClick={onOpenPlayground}
    />
  );
};

export default Request;
