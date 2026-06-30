import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

/**
 * The endpoint search palette. A page-wide control (its panel is a fixed
 * overlay), so it omits a container root. Parts are found by accessible role or
 * test id, never by class.
 */
export class SearchComponent extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  /** Inline combobox field (desktop / once revealed below desktop). */
  readonly field = this.root.getByRole('combobox', { name: 'Search endpoints' });
  /** The panel element (open state is reflected by its `data-open` attribute). */
  readonly panel = this.root.getByTestId('search-panel');
  readonly openPanel = this.root.locator('[data-testid="search-panel"][data-open="true"]');
  readonly filters = this.root.getByTestId('search-filters');
  readonly resultsList = this.root.getByTestId('search-results');
  readonly results = this.root.getByTestId('search-result');
  readonly resultMethods = this.root.getByTestId('search-result-method');
  readonly clearButton = this.root.getByRole('button', { name: 'Clear search' });
  /** Below-desktop Topbar trigger that reveals the search. */
  readonly toggleIcon = this.root.getByRole('button', { name: /^search$/i });
  readonly folderButton = this.root.getByRole('button', { name: 'Folder', exact: true });

  methodChip(label: string): Locator {
    return this.root.getByRole('button', { name: label, exact: true });
  }

  folderOption(name: string): Locator {
    return this.root.getByRole('button', { name, exact: true });
  }

  result(text: string): Locator {
    return this.results.filter({ hasText: text });
  }
}
