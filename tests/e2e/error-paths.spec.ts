import { expect, type Page, test } from '@playwright/test';

async function solve(page: Page, expression: string) {
  await page.getByLabel('Calculator expression').fill(expression);
  await page.getByRole('button', { name: 'Solve' }).click();
}

test.describe('Error handling and edge cases', () => {
  test('shows an age-appropriate message for empty input', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Solve' }).click();

    await expect(page.getByText('Start with a number')).toBeVisible();
    await expect(page.getByText('A math expression needs at least one number')).toBeVisible();
    await expect(page.getByText('Enter a math expression.')).toHaveCount(0);
  });

  test('shows an age-appropriate message for malformed expressions', async ({ page }) => {
    await page.goto('/');
    await solve(page, '8 +');

    await expect(page.getByText('A number goes here')).toBeVisible();
    await expect(page.getByText('Add a number, or put a full expression')).toBeVisible();
    await expect(page.getByText('expected-expression')).toHaveCount(0);
  });

  test('shows an age-appropriate message for divide by zero', async ({ page }) => {
    await page.goto('/');
    await solve(page, '8 / 0');

    await expect(page.getByText('Try a different divisor')).toBeVisible();
    await expect(page.getByText('Change the number after the division sign')).toBeVisible();
    await expect(page.getByText('Division by zero is not defined.')).toHaveCount(0);
  });

  test('shows an order-of-operations hint without blocking a valid result', async ({ page }) => {
    await page.goto('/');
    await solve(page, '2 + 3 * 4');

    await expect(page.getByLabel('Quick result')).toContainText('14');
    await expect(page.getByText('Order of operations heads-up')).toBeVisible();
    await expect(page.getByText('Multiplication and division are solved first.')).toBeVisible();
  });

  test('keeps invalid input stable when switching into and out of Guided mode', async ({
    page,
  }) => {
    await page.goto('/');

    await page.getByLabel('Calculator expression').fill('8 / 0');
    await page.getByRole('button', { name: 'Switch to Guided mode' }).click();
    await expect(page.getByLabel('Calculator expression')).toHaveValue('8 / 0');
    await expect(page.getByLabel('Quick result')).toHaveCount(0);
    await expect(page.getByText('Division by zero is not defined.')).toHaveCount(0);

    await page.getByRole('button', { name: 'Switch to Quick mode' }).click();
    await page.getByRole('button', { name: 'Solve' }).click();
    await expect(page.getByText('Try a different divisor')).toBeVisible();
  });
});
