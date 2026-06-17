/* eslint-disable react-refresh/only-export-components -- dev-only render entry, not a component module */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { computeCanRunBrunoApp } from './components/Topbar/useCanRunBrunoApp';

/**
 * Dev-only diagnostic page for verifying the Open-in-Bruno capability gate on
 * real devices (iPad Pro, Surface, etc.). Prints the raw signals + the computed
 * decision so the matrix can be checked before locking the logic. NOT shipped.
 */
const mq = (q: string) => (typeof window !== 'undefined' ? window.matchMedia(q).matches : false);

const Row: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <tr>
    <td style={{ padding: '6px 16px 6px 0', color: '#666', whiteSpace: 'nowrap' }}>{k}</td>
    <td style={{ padding: '6px 0', fontFamily: 'monospace', wordBreak: 'break-all' }}>{String(v)}</td>
  </tr>
);

const DeviceCheck: React.FC = () => {
  const signals = {
    'matchMedia (pointer: fine)': mq('(pointer: fine)'),
    'matchMedia (pointer: coarse)': mq('(pointer: coarse)'),
    'matchMedia (any-pointer: fine)': mq('(any-pointer: fine)'),
    'matchMedia (any-pointer: coarse)': mq('(any-pointer: coarse)'),
    'matchMedia (hover: hover)': mq('(hover: hover)'),
    'matchMedia (hover: none)': mq('(hover: none)'),
    'matchMedia (any-hover: hover)': mq('(any-hover: hover)'),
    'navigator.maxTouchPoints': navigator.maxTouchPoints,
    'navigator.platform': navigator.platform,
    'window.innerWidth': window.innerWidth,
    'navigator.userAgent': navigator.userAgent,
  };

  const anyHoverFine = mq('(any-hover: hover) and (any-pointer: fine)');
  const showCTA = computeCanRunBrunoApp({
    anyHoverFine,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 820 }}>
      <h1 style={{ fontSize: 20 }}>Topbar device check</h1>
      <p
        style={{
          fontSize: 18,
          fontWeight: 700,
          padding: '10px 14px',
          borderRadius: 8,
          background: showCTA ? '#e6f6ec' : '#fdeaea',
          color: showCTA ? '#177245' : '#b3261e',
        }}
      >
        Open-in-Bruno CTA → {showCTA ? 'SHOWN' : 'HIDDEN'}
      </p>
      <table style={{ borderCollapse: 'collapse', fontSize: 13 }}>
        <tbody>
          {Object.entries(signals).map(([k, v]) => (
            <Row key={k} k={k} v={v} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<DeviceCheck />);
}
