import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { SearchResultItem } from './SearchResultItem';
import type { SearchRecord } from '../../../utils/searchIndex';

const record: SearchRecord = {
  id: 'u1',
  slug: 'hotels/get-all',
  name: 'Get All Hotels',
  method: 'GET',
  breadcrumb: 'Hotels / Browse & search',
  ancestorSlugs: ['hotels'],
  url: '{{baseUrl}}/api/v1/hotels',
  params: '',
  description: '',
};

describe('SearchResultItem', () => {
  it('renders method badge, name, breadcrumb and url', () => {
    const html = renderToStaticMarkup(<SearchResultItem record={record} onSelect={() => {}} />);
    expect(html).toContain('GET');
    expect(html).toContain('Get All Hotels');
    expect(html).toContain('Hotels / Browse &amp; search');
    expect(html).toContain('/api/v1/hotels');
  });

  it('omits the url line when there is no url', () => {
    const html = renderToStaticMarkup(
      <SearchResultItem record={{ ...record, url: '' }} onSelect={() => {}} />,
    );
    // The class lives in the injected emotion CSS regardless; assert the actual
    // url <span> element (class attribute) is not rendered.
    expect(html).not.toContain('class="oc-search-result__url"');
  });
});
