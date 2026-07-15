import type { EvaluationStep } from '../math';
import type { GuidedStep, GuidedVisualization } from './stepGenerator';

export type GuidedCopyTopic =
  'arithmetic' | 'decimal' | 'fraction' | 'multiplication' | 'order-of-operations' | 'percentage';

export type GuidedStepCopy = {
  body: string;
  hint: string;
  title: string;
  topic: GuidedCopyTopic;
};

const topicCopy: Record<GuidedCopyTopic, GuidedStepCopy> = {
  arithmetic: {
    body: 'Nice: this part is ready to solve directly. Work with the two numbers in the highlighted operation, then carry the result forward.',
    hint: 'Keep the rest of the expression in place until its turn comes.',
    title: 'Solve this part',
    topic: 'arithmetic',
  },
  decimal: {
    body: 'Good setup: decimals follow the same operation rules as whole numbers. Line up the values, solve this part, and keep the decimal point with the result.',
    hint: 'Estimate first if you want a quick reasonableness check.',
    title: 'Handle the decimal carefully',
    topic: 'decimal',
  },
  fraction: {
    body: 'Nice: the fraction is showing equal parts of one whole. The numerator tells how many parts are filled, and the denominator tells how many equal parts make the whole.',
    hint: 'Read the fraction as filled parts over total equal parts.',
    title: 'Read the fraction',
    topic: 'fraction',
  },
  multiplication: {
    body: 'Nice: here is how multiplication builds. Each row has the same number of units, and the rows together make the product.',
    hint: 'Count rows times columns to check the result.',
    title: 'Build the product',
    topic: 'multiplication',
  },
  'order-of-operations': {
    body: 'This is the next part to resolve. Solving one highlighted operation at a time keeps the order of operations clear.',
    hint: 'Parentheses come first, then multiplication or division, then addition or subtraction.',
    title: 'Follow the order',
    topic: 'order-of-operations',
  },
  percentage: {
    body: 'Good: a percent compares a value to one whole split into 100 equal parts. The filled bar shows how much of the whole this percent covers.',
    hint: 'Divide the percent by 100 to write it as a decimal.',
    title: 'Connect percent to the whole',
    topic: 'percentage',
  },
};

function hasDecimalValue(step: EvaluationStep) {
  return (
    !Number.isInteger(step.result) ||
    step.operands.some((operand) => !Number.isInteger(operand)) ||
    step.before.includes('.')
  );
}

function topicForVisualization(visualization: GuidedVisualization): GuidedCopyTopic {
  switch (visualization.kind) {
    case 'fraction-slice':
      return 'fraction';
    case 'multiplication-grid':
      return 'multiplication';
    case 'percentage-bar':
      return 'percentage';
  }
}

export function getGuidedStepCopy(step: GuidedStep): GuidedStepCopy {
  if (step.presentation.kind === 'visual-breakdown') {
    return topicCopy[topicForVisualization(step.presentation.visualization)];
  }

  if (step.sourceStep.kind === 'fraction') {
    return topicCopy.fraction;
  }

  if (step.sourceStep.kind === 'percentage') {
    return topicCopy.percentage;
  }

  if (hasDecimalValue(step.sourceStep)) {
    return topicCopy.decimal;
  }

  if (step.sourceStep.kind === 'binary' && step.sourceStep.operator === '/') {
    return topicCopy['order-of-operations'];
  }

  return topicCopy.arithmetic;
}

export function getGuidedStepCopies(steps: GuidedStep[]) {
  return steps.map(getGuidedStepCopy);
}
