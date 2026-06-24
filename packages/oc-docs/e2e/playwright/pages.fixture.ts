import { test as base } from '@playwright/test';
import { PageHeaderComponent } from '../components/page-header.component';

/**
 * Layout components the app uses on every screen are handed to tests directly,
 * e.g. `pageHeader` (and later `sidebar`), so a test writes
 * `pageHeader.openSearch()` rather than `layout.header.openSearch()`.
 */
type Fixtures = {
  pageHeader: PageHeaderComponent;
};

export const test = base.extend<Fixtures>({
  pageHeader: async ({ page }, use) => {
    await use(new PageHeaderComponent(page));
  }
});
