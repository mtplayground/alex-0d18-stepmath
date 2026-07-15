import { expect, test } from '@playwright/test';
import { generateGuidedSteps } from '../../src/lib/guided';
import { evaluateExpressionAst, parseExpression } from '../../src/lib/math';

const quickCases = [
  { expression: '8 + 4', name: 'whole-number arithmetic', result: '12' },
  { expression: '2 + 3 * 4', name: 'order of operations', result: '14' },
  { expression: '1/2 + 1/4', name: 'fractions', result: '0.75' },
  { expression: '3.5 + 2.25', name: 'decimals', result: '5.75' },
  { expression: '25%', name: 'percentages', result: '0.25' },
];

const guidedCases = [
  { expression: '8 + 4', expectedPresentation: 'highlighted-symbolic', name: 'arithmetic' },
  { expression: '2 + 3 * 4', expectedPresentation: 'highlighted-symbolic', name: 'order' },
  { expression: '1/2', expectedVisualization: 'fraction-slice', name: 'fractions' },
  { expression: '3.5 + 2.25', expectedPresentation: 'highlighted-symbolic', name: 'decimals' },
  { expression: '25%', expectedVisualization: 'percentage-bar', name: 'percentages' },
  { expression: '3 * 4', expectedVisualization: 'multiplication-grid', name: 'multiplication' },
];

async function solveQuickExpression(page: import('@playwright/test').Page, expression: string) {
  await page.getByLabel('Calculator expression').fill(expression);
  await page.getByRole('button', { name: 'Solve' }).click();
}

function guidedStepsFor(expression: string) {
  const parsed = parseExpression(expression);
  expect(parsed.ok).toBe(true);

  if (!parsed.ok) {
    throw new Error(`Expected ${expression} to parse`);
  }

  const evaluated = evaluateExpressionAst(parsed.ast);
  expect(evaluated.ok).toBe(true);

  if (!evaluated.ok) {
    throw new Error(`Expected ${expression} to evaluate`);
  }

  return generateGuidedSteps(evaluated.trace);
}

test.describe('Quick mode', () => {
  for (const quickCase of quickCases) {
    test(`solves ${quickCase.name}`, async ({ page }) => {
      await page.goto('/');
      await solveQuickExpression(page, quickCase.expression);

      await expect(page.getByLabel('Quick result')).toContainText(quickCase.result);
    });
  }

  test('preserves the expression when switching modes mid-flow', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Calculator expression').fill('3.5 + 2.25');
    await page.getByRole('button', { name: 'Switch to Guided mode' }).click();
    await expect(page.getByLabel('Calculator expression')).toHaveValue('3.5 + 2.25');

    await page.getByRole('button', { name: 'Switch to Quick mode' }).click();
    await solveQuickExpression(page, '3.5 + 2.25');
    await expect(page.getByLabel('Quick result')).toContainText('5.75');
  });
});

test.describe('Guided step generation', () => {
  for (const guidedCase of guidedCases) {
    test(`routes ${guidedCase.name} to the expected presentation`, () => {
      const steps = guidedStepsFor(guidedCase.expression);
      expect(steps.length).toBeGreaterThan(0);

      if (guidedCase.expectedVisualization) {
        expect(
          steps.some(
            (step) =>
              step.presentation.kind === 'visual-breakdown' &&
              step.presentation.visualization.kind === guidedCase.expectedVisualization,
          ),
        ).toBe(true);
        return;
      }

      expect(steps.some((step) => step.presentation.kind === guidedCase.expectedPresentation)).toBe(
        true,
      );
    });
  }
});
