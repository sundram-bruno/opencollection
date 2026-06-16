/* eslint-disable react-refresh/only-export-components -- dev-only render entry, not a component module */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { Topbar } from './components/Topbar';

/**
 * Dev-only harness for e2e-testing the Topbar with both slots filled.
 * NOT part of the shipped standalone build — it exists so Playwright can
 * exercise the mobile search-expand and overflow popover, which require the
 * search / env-switcher slot nodes that downstream tickets supply.
 */
const SearchSlot: React.FC = () => (
  <input
    data-testid="search-slot-input"
    placeholder="Search endpoints…"
    style={{
      width: '100%',
      height: '28px',
      boxSizing: 'border-box',
      padding: '5px 8px',
      border: '1px solid var(--oc-border-border1)',
      borderRadius: 'var(--oc-border-radius-base)',
      background: 'var(--oc-background-base)',
      color: 'var(--oc-text)',
      fontFamily: 'var(--font-sans)',
    }}
  />
);

const EnvSwitcherSlot: React.FC = () => (
  <div data-testid="env-switcher-slot" style={{ display: 'flex', gap: '8px' }}>
    <span>Show vars</span>
    <span>Development</span>
  </div>
);

const HarnessApp: React.FC = () => (
  <div style={{ minHeight: '200vh' }}>
    <Topbar
      collectionName="Hotel Booking API"
      version="v1.0.0"
      searchSlot={<SearchSlot />}
      envSwitcherSlot={<EnvSwitcherSlot />}
      openInBrunoHref="bruno://app/collection/import/git?url=https%3A%2F%2Fexample.com%2Frepo.git"
      onToggleSidebar={() => {
        (window as unknown as { __toggleSidebarCalls?: number }).__toggleSidebarCalls =
          ((window as unknown as { __toggleSidebarCalls?: number }).__toggleSidebarCalls ?? 0) + 1;
      }}
    />
    <div style={{ padding: '24px' }}>Scroll content to verify the bar stays pinned.</div>
  </div>
);

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<HarnessApp />);
}
