import { test, expect, type Page } from '@playwright/test';

test.use({ colorScheme: 'light' });

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 800 };

const dialog = (page: Page) => page.getByRole('dialog', { name: 'Search endpoints' });
const input = (page: Page) => page.getByRole('textbox', { name: 'Search endpoints' });

/** Open the palette via the Topbar trigger pill (desktop). */
const openViaTrigger = async (page: Page) => {
  await page.getByRole('button', { name: 'Search endpoints' }).click();
  await expect(dialog(page)).toBeVisible();
};

test.describe('Search palette (BRU-3573)', () => {
  test('platform shortcut (⌘K / Ctrl+K) opens the palette and focuses the input', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    await expect(dialog(page)).toHaveCount(0);
    const isMac = await page.evaluate(() => /Mac|iPhone|iPad|iPod/.test(navigator.platform));
    await page.keyboard.press(isMac ? 'Meta+k' : 'Control+k');

    await expect(dialog(page)).toBeVisible();
    await expect(input(page)).toBeFocused();
  });

  test('clicking the trigger shows the initial empty state', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await openViaTrigger(page);

    await expect(dialog(page)).toContainText('Search the collection');
    await expect(dialog(page)).toContainText('Find any request by name, endpoint, or description.');
  });

  test('typing fuzzy-matches over request names', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await openViaTrigger(page);

    await input(page).fill('user');
    const results = page.locator('.oc-search__list [role="option"]');
    await expect(results.first()).toBeVisible();
    await expect(dialog(page)).toContainText('update user');
  });

  test('selecting a result navigates to its page and closes the palette', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await openViaTrigger(page);

    await input(page).fill('get users');
    await page.locator('.oc-search__list [role="option"]', { hasText: 'get users' }).first().click();

    await expect(dialog(page)).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /get users/i, level: 1 })).toBeVisible();
    expect(page.url()).toContain('#/');
  });

  test('shows an empty state when nothing matches', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await openViaTrigger(page);

    await input(page).fill('zzzqqq-nomatch');
    await expect(dialog(page)).toContainText('No results');
    await expect(page.locator('.oc-search__list')).toHaveCount(0);
  });

  test('Escape closes the palette', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await openViaTrigger(page);

    await page.keyboard.press('Escape');
    await expect(dialog(page)).toHaveCount(0);
  });

  test('method chip filters results to that method (empty query lists them)', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await openViaTrigger(page);

    await page.getByRole('button', { name: 'GET', exact: true }).click();
    const results = page.locator('.oc-search__list [role="option"]');
    await expect(results.first()).toBeVisible();
    // Every visible badge is a GET; no other methods leak through.
    await expect(page.locator('.oc-search__results .post')).toHaveCount(0);
    await expect(page.locator('.oc-search__results .delete')).toHaveCount(0);
    await expect(page.locator('.oc-search__results .get').first()).toBeVisible();
  });

  test('folder filter scopes results to the chosen folder', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/?fixture=folders');
    await openViaTrigger(page);

    await page.getByRole('button', { name: 'Folder', exact: true }).click();
    await page.getByRole('button', { name: 'Authentication', exact: true }).click();

    await expect(dialog(page)).toContainText('Login');
    // A request from another top-level folder (Bookings) is excluded.
    await expect(dialog(page)).not.toContainText('Create Booking');
  });

  test('mobile: the Topbar search icon opens the palette (single tap)', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');

    await expect(dialog(page)).toHaveCount(0);
    await page.getByRole('button', { name: /^search$/i }).click();
    await expect(dialog(page)).toBeVisible();
    await expect(input(page)).toBeVisible();
  });
});
