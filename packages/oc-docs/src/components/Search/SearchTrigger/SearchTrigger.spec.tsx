import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { SearchTrigger } from './SearchTrigger';

describe('SearchTrigger', () => {
  it('renders the search affordance with a placeholder label', () => {
    const html = renderToStaticMarkup(<SearchTrigger onOpen={() => {}} />);
    expect(html).toContain('Search endpoints');
    expect(html).toContain('aria-haspopup="dialog"');
  });
});
