import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { MethodChips } from './MethodChips';

describe('MethodChips', () => {
  it('renders the four method chips', () => {
    const html = renderToStaticMarkup(<MethodChips active={new Set()} onToggle={() => {}} />);
    for (const label of ['GET', 'POST', 'PUT', 'DEL']) {
      expect(html).toContain(`>${label}<`);
    }
  });

  it('marks active methods as pressed (DEL maps to DELETE)', () => {
    const html = renderToStaticMarkup(
      <MethodChips active={new Set(['DELETE'])} onToggle={() => {}} />,
    );
    // The DEL chip is pressed, others are not.
    expect(html).toMatch(/aria-pressed="true"[^>]*>DEL</);
    expect(html).toMatch(/aria-pressed="false"[^>]*>GET</);
  });
});
