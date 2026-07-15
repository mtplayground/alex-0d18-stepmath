import { expect, test } from '@playwright/test';

test.describe('Static production deployment', () => {
  test('emits directory-safe asset references in the built index', async ({ request }) => {
    const response = await request.get('/index.html');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('text/html');

    const html = await response.text();
    expect(html).toContain('src="./assets/');
    expect(html).toContain('href="./assets/');
    expect(html).not.toMatch(/\s(?:href|src)="\/(?!\/)/);

    const assetPaths = Array.from(html.matchAll(/(?:href|src)="(\.\/assets\/[^"]+)"/g), (match) =>
      match[1].replace('./', '/'),
    );
    expect(assetPaths.length).toBeGreaterThanOrEqual(2);

    for (const assetPath of assetPaths) {
      const assetResponse = await request.get(assetPath);
      expect(assetResponse.ok()).toBe(true);
    }
  });

  test('runs the calculator from the static preview output', async ({ page }) => {
    const runtimeErrors: string[] = [];
    const failedAssetUrls: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        runtimeErrors.push(message.text());
      }
    });
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('response', (response) => {
      const path = new URL(response.url()).pathname;

      if (path.startsWith('/assets/') && !response.ok()) {
        failedAssetUrls.push(response.url());
      }
    });

    await page.goto('/index.html', { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: 'Calculator' })).toBeVisible();
    await page.getByLabel('Calculator expression').fill('6 * 7');
    await page.getByRole('button', { name: 'Solve' }).click();
    await expect(page.getByLabel('Quick result')).toContainText('42');
    expect(runtimeErrors).toEqual([]);
    expect(failedAssetUrls).toEqual([]);
  });
});
