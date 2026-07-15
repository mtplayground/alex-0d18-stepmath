import type { GuidedStep } from '../../lib/guided';
import { FractionSlice, MultiplicationGrid, PercentageBar } from '../visualizations';
import { HighlightedStepDisplay } from './HighlightedStepDisplay';

export type GuidedStepDisplayProps = {
  expression?: string;
  revealedUnits?: number;
  step: GuidedStep;
};

export function GuidedStepDisplay({ expression, revealedUnits, step }: GuidedStepDisplayProps) {
  const { presentation } = step;

  if (presentation.kind === 'highlighted-symbolic') {
    return <HighlightedStepDisplay expression={expression} step={step} />;
  }

  const { visualization } = presentation;

  switch (visualization.kind) {
    case 'multiplication-grid':
      return (
        <MultiplicationGrid
          factors={visualization.factors}
          product={visualization.product}
          revealedUnits={revealedUnits}
        />
      );

    case 'fraction-slice':
      return (
        <FractionSlice
          denominator={visualization.denominator}
          filledPortion={visualization.filledPortion}
          numerator={visualization.numerator}
        />
      );

    case 'percentage-bar':
      return (
        <PercentageBar
          decimal={visualization.decimal}
          filledPortion={visualization.filledPortion}
          percent={visualization.percent}
        />
      );
  }
}
