import type { EvaluationStep } from '../math';

export type HighlightedSymbolicStep = {
  after: string;
  before: string;
  kind: 'highlighted-symbolic';
  span: EvaluationStep['span'];
};

export type GuidedVisualization =
  | {
      factors: [number, number];
      kind: 'multiplication-grid';
      product: number;
    }
  | {
      denominator: number;
      filledPortion: number;
      kind: 'fraction-slice';
      numerator: number;
    }
  | {
      decimal: number;
      filledPortion: number;
      kind: 'percentage-bar';
      percent: number;
    };

export type VisualBreakdownStep = {
  after: string;
  before: string;
  kind: 'visual-breakdown';
  span: EvaluationStep['span'];
  visualization: GuidedVisualization;
};

export type GuidedStepPresentation = HighlightedSymbolicStep | VisualBreakdownStep;

export type GuidedStep = {
  id: string;
  order: number;
  presentation: GuidedStepPresentation;
  sourceStep: EvaluationStep;
  title: string;
};

function titleForStep(step: EvaluationStep) {
  if (step.kind === 'fraction') {
    return 'Break apart the fraction';
  }

  if (step.kind === 'percentage') {
    return 'Turn the percent into a value';
  }

  if (step.kind === 'binary' && step.operator === '*') {
    return 'Build the multiplication';
  }

  if (step.kind === 'unary') {
    return 'Apply the sign';
  }

  return 'Solve this part';
}

function visualForStep(step: EvaluationStep): GuidedVisualization | undefined {
  if (step.kind === 'binary' && step.operator === '*' && step.operands.length >= 2) {
    return {
      factors: [step.operands[0], step.operands[1]],
      kind: 'multiplication-grid',
      product: step.result,
    };
  }

  if (step.visual?.kind === 'fraction') {
    return {
      denominator: step.visual.denominator,
      filledPortion: step.visual.filledPortion,
      kind: 'fraction-slice',
      numerator: step.visual.numerator,
    };
  }

  if (step.visual?.kind === 'percentage') {
    return {
      decimal: step.visual.decimal,
      filledPortion: step.visual.filledPortion,
      kind: 'percentage-bar',
      percent: step.visual.percent,
    };
  }

  return undefined;
}

function presentationForStep(step: EvaluationStep): GuidedStepPresentation {
  const visualization = visualForStep(step);

  if (visualization) {
    return {
      after: step.after,
      before: step.before,
      kind: 'visual-breakdown',
      span: step.span,
      visualization,
    };
  }

  return {
    after: step.after,
    before: step.before,
    kind: 'highlighted-symbolic',
    span: step.span,
  };
}

export function generateGuidedSteps(trace: EvaluationStep[]): GuidedStep[] {
  return [...trace]
    .sort((left, right) => left.order - right.order)
    .map((step) => ({
      id: `guided-${step.id}`,
      order: step.order,
      presentation: presentationForStep(step),
      sourceStep: step,
      title: titleForStep(step),
    }));
}
