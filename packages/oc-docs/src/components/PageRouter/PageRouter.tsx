import React from 'react';
import { Navigate } from 'react-router-dom';
import { useActiveResolution } from '../../routing/hooks';
import { useAppSelector } from '../../store/hooks';
import { selectDocsCollection } from '../../store/slices/docs';
import { PrevNext } from '../PrevNext';
import { Overview } from '../../pages/Overview';
import Request from '../../pages/Request';
import Environments from '../../pages/Environments';
import Script from '../../pages/Script';
import type { PageProps } from '../../routing/types';

interface PageRouterProps {
  onOpenPlayground?: () => void;
}

/**
 * Selects the page for the active slug and appends the prev/next chrome
 * (BRU-3188). Overview is BRU-2571's real page (consumes `collection`); request
 * and folder reuse the `Item`-based Request page; environments/script are
 * scaffold placeholders. Unknown slugs redirect to the overview.
 */
const PageRouter: React.FC<PageRouterProps> = ({ onOpenPlayground }) => {
  const resolution = useActiveResolution();
  const collection = useAppSelector(selectDocsCollection);

  if (!resolution) return <Navigate to="/" replace />;
  if (!collection) return null;

  const { entry, prev, next } = resolution;
  const pageProps: PageProps = { node: entry, prev, next, collection, onOpenPlayground };

  const renderBody = () => {
    switch (entry.type) {
      case 'overview':
        return <Overview collection={collection} />;
      case 'environments':
        return <Environments {...pageProps} />;
      case 'script':
        return <Script {...pageProps} />;
      case 'request':
      case 'folder':
      default:
        return <Request {...pageProps} />;
    }
  };

  return (
    <div data-testid="page" data-page-type={entry.type} data-page-slug={entry.slug}>
      {renderBody()}
      <PrevNext prev={prev} next={next} />
    </div>
  );
};

export default PageRouter;
