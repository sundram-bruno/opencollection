import React, { useCallback, useEffect, useState } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Folder } from '@opencollection/types/collection/item';
import { Topbar } from '../Topbar';
import Sidebar from '../Docs/Sidebar/Sidebar';
import { PageRouter } from '../PageRouter';
import PlaygroundDrawer from '../PlaygroundDrawer/PlaygroundDrawer';
import { SearchBar } from '../Search';
import { useAppSelector } from '../../store/hooks';
import { selectDocsCollection } from '../../store/slices/docs';
import { selectPlaygroundCollection } from '../../store/slices/playground';
import { selectGitCollectionUrl } from '../../store/slices/app';
import { useActiveResolution } from '../../routing/hooks';
import { buildBrunoDeepLink } from '../../utils/buildBrunoDeepLink';
import { AppShellWrapper } from './StyledWrapper';

interface AppShellProps {
  logo?: React.ReactNode;
}

/**
 * Routed shell (BRU-3188): real Topbar (BRU-3572) + Sidebar + a single routed
 * page. The active page is derived from the URL; the playground drawer overlays
 * and is driven by the active request/folder node.
 */
const AppShell: React.FC<AppShellProps> = ({ logo }) => {
  const collection = useAppSelector(selectDocsCollection);
  const playgroundCollection = useAppSelector(selectPlaygroundCollection);
  const gitCollectionUrl = useAppSelector(selectGitCollectionUrl);
  const resolution = useActiveResolution();

  const [showDrawer, setShowDrawer] = useState(false);
  const [playgroundItem, setPlaygroundItem] = useState<HttpRequest | Folder | null>(null);

  const activeItem = resolution?.entry.item ?? null;
  const activeType = resolution?.entry.type;
  useEffect(() => {
    if (activeItem && (activeType === 'request' || activeType === 'folder')) {
      setPlaygroundItem(activeItem as HttpRequest | Folder);
    }
  }, [activeItem, activeType]);

  const handleOpenPlayground = useCallback(() => setShowDrawer(true), []);

  return (
    <AppShellWrapper className="oc-appshell">
      <Topbar
        collectionName={collection?.info?.name || 'API Collection'}
        version={collection?.info?.version}
        logo={logo}
        searchSlot={<SearchBar />}
        openInBrunoHref={buildBrunoDeepLink(gitCollectionUrl)}
      />

      <div className="oc-appshell__row">
        <aside className="oc-appshell__sidebar">
          <Sidebar />
        </aside>
        <main className="oc-appshell__content">
          <PageRouter onOpenPlayground={handleOpenPlayground} />
        </main>
      </div>

      <PlaygroundDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        collection={playgroundCollection}
        selectedItem={playgroundItem}
        onSelectItem={setPlaygroundItem}
      />
    </AppShellWrapper>
  );
};

export default AppShell;
