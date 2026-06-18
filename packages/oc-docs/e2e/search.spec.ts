import { test, expect, type Page } from '@playwright/test';

test.use({ colorScheme: 'light' });

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 800 };

const combo = (page: Page) => page.getByRole('combobox', { name: 'Search endpoints' });
const panel = (page: Page) => page.locator('.oc-search__panel');
const openPanel = (page: Page) => page.locator('.oc-search__panel[data-open="true"]');
const filters = (page: Page) => page.locator('.oc-search__filters');

test.describe('Search palette (BRU-3573)', () => {
  test('expands in place on focus — no modal/backdrop', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    // The field lives in the header; the panel is collapsed until focus.
    await expect(combo(page)).toBeVisible();
    await expect(openPanel(page)).toHaveCount(0);
    // No centered modal dialog anywhere.
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await combo(page).click();
    await expect(openPanel(page)).toBeVisible();
    await expect(filters(page)).toBeVisible();
    // Anchored under the header (top of panel near the top of the viewport).
    const box = await openPanel(page).boundingBox();
    expect(box?.y ?? 999).toBeLessThan(80);
  });

  test('platform shortcut (⌘K / Ctrl+K) focuses and opens the field', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    const isMac = await page.evaluate(() => /Mac|iPhone|iPad|iPod/.test(navigator.platform));
    await page.keyboard.press(isMac ? 'Meta+k' : 'Control+k');

    await expect(openPanel(page)).toBeVisible();
    await expect(combo(page)).toBeFocused();
  });

  test('shows the initial empty state before typing', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await combo(page).click();

    await expect(panel(page)).toContainText('Search the collection');
    await expect(panel(page)).toContainText('Find any request by name, endpoint, or description.');
  });

  test('typing fuzzy-matches over request names', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await combo(page).click();
    await combo(page).fill('user');

    await expect(page.locator('.oc-search__list [role="option"]').first()).toBeVisible();
    await expect(panel(page)).toContainText('update user');
  });

  test('selecting a result navigates to its page and closes the panel', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await combo(page).click();
    await combo(page).fill('get users');
    await page.locator('.oc-search__list [role="option"]', { hasText: 'get users' }).first().click();

    await expect(openPanel(page)).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /get users/i, level: 1 })).toBeVisible();
  });

  test('selecting a result clears the query (no lingering search/filter)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await combo(page).click();
    await combo(page).fill('get users');
    await page.locator('.oc-search__list [role="option"]', { hasText: 'get users' }).first().click();

    await expect(openPanel(page)).toHaveCount(0);
    // Reopen — the query must have been reset on select.
    await combo(page).click();
    await expect(combo(page)).toHaveValue('');
  });

  test('shows an empty state when nothing matches', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await combo(page).click();
    await combo(page).fill('zzzqqq-nomatch');

    await expect(panel(page)).toContainText('No matching requests');
    await expect(page.locator('.oc-search__list')).toHaveCount(0);
  });

  test('Escape clears and closes', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await combo(page).click();
    await combo(page).fill('user');
    await page.keyboard.press('Escape');

    await expect(openPanel(page)).toHaveCount(0);
  });

  test('clicking outside closes the panel', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await combo(page).click();
    await expect(openPanel(page)).toBeVisible();

    await page.locator('main').click({ position: { x: 50, y: 300 } });
    await expect(openPanel(page)).toHaveCount(0);
  });

  test('method chip filters results to that method (empty query lists them)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await combo(page).click();
    await page.getByRole('button', { name: 'GET', exact: true }).click();

    await expect(page.locator('.oc-search__list [role="option"]').first()).toBeVisible();
    // Every result's method label reads GET — no other method leaks through.
    const methods = page.locator('.oc-search-result__method');
    const count = await methods.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(methods.nth(i)).toHaveText('GET');
    }
  });

  test('folder filter scopes results to the chosen folder', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/?fixture=folders');
    await combo(page).click();

    await page.getByRole('button', { name: 'Folder', exact: true }).click();
    await page.getByRole('button', { name: 'Authentication', exact: true }).click();

    await expect(panel(page)).toContainText('Login');
    await expect(panel(page)).not.toContainText('Create Booking');
  });

  test('tablet: inline search field, panel stays within the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto('/');

    // Inline field on tablet (like desktop) — no collapsed search icon.
    await expect(combo(page)).toBeVisible();
    await expect(page.getByRole('button', { name: /^search$/i })).toHaveCount(0);

    await combo(page).click();
    await expect(openPanel(page)).toBeVisible();
    const box = await openPanel(page).boundingBox();
    expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(900);
  });

  test('mobile: the Topbar search icon opens the panel (single tap)', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');

    await expect(openPanel(page)).toHaveCount(0);
    await page.getByRole('button', { name: /^search$/i }).click();
    await expect(openPanel(page)).toBeVisible();
    await expect(combo(page)).toBeVisible();

    // Full-width sheet pinned within the viewport (no translateX shift).
    const box = await openPanel(page).boundingBox();
    expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(MOBILE.width);
  });

  test('mobile: opening search does not grow the header', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');

    const header = page.locator('header.oc-topbar');
    const before = (await header.boundingBox())?.height ?? 0;

    await page.getByRole('button', { name: /^search$/i }).click();
    await expect(openPanel(page)).toBeVisible();

    // The panel is a fixed overlay; the sticky header must not grow / shift the page.
    const after = (await header.boundingBox())?.height ?? 0;
    expect(after).toBe(before);
  });

  test('mobile: closing search returns to just the icon (no leftover field)', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');

    await page.getByRole('button', { name: /^search$/i }).click();
    await expect(combo(page)).toBeVisible();

    await page.getByRole('button', { name: 'Clear search' }).click();
    // Field + row gone; only the Topbar search icon remains (no redundant pair).
    await expect(combo(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^search$/i })).toBeVisible();
  });
});
