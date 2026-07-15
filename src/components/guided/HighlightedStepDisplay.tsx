import type { GuidedStep, HighlightedSymbolicStep } from '../../lib/guided';
import type { SourceSpan } from '../../lib/math';

type SymbolicDisplayStep = GuidedStep | HighlightedSymbolicStep;

export type HighlightedStepDisplayProps = {
  expression?: string;
  step: SymbolicDisplayStep;
};

type HighlightParts = {
  after: string;
  before: string;
  highlight: string;
  prefix: string;
  suffix: string;
  title?: string;
};

function isGuidedStep(step: SymbolicDisplayStep): step is GuidedStep {
  return 'presentation' in step;
}

function getSymbolicPresentation(step: SymbolicDisplayStep): HighlightedSymbolicStep {
  if (isGuidedStep(step)) {
    if (step.presentation.kind === 'highlighted-symbolic') {
      return step.presentation;
    }

    return {
      after: step.presentation.after,
      before: step.presentation.before,
      kind: 'highlighted-symbolic',
      span: step.presentation.span,
    };
  }

  return step;
}

function canUseSpan(expression: string | undefined, span: SourceSpan) {
  return Boolean(
    expression &&
    span.start >= 0 &&
    span.end <= expression.length &&
    span.start < span.end &&
    expression.slice(span.start, span.end).trim().length > 0,
  );
}

function getHighlightParts(step: SymbolicDisplayStep, expression?: string): HighlightParts {
  const presentation = getSymbolicPresentation(step);
  const title = isGuidedStep(step) ? step.title : undefined;

  if (canUseSpan(expression, presentation.span)) {
    const source = expression as string;

    return {
      after: presentation.after,
      before: source,
      highlight: source.slice(presentation.span.start, presentation.span.end),
      prefix: source.slice(0, presentation.span.start),
      suffix: source.slice(presentation.span.end),
      title,
    };
  }

  return {
    after: presentation.after,
    before: presentation.before,
    highlight: presentation.before,
    prefix: '',
    suffix: '',
    title,
  };
}

export function HighlightedStepDisplay({ expression, step }: HighlightedStepDisplayProps) {
  const parts = getHighlightParts(step, expression);
  const label = parts.title ?? 'Order step';

  return (
    <section
      aria-label={label}
      className="grid gap-4 rounded-panel border border-cobalt-100 bg-paper p-5 shadow-control"
    >
      <div className="flex flex-col gap-1">
        <p className="text-eyebrow uppercase text-cobalt-600">Order step</p>
        {parts.title ? (
          <h3 className="text-lead font-extrabold text-ink-950">{parts.title}</h3>
        ) : null}
      </div>

      <div className="grid gap-3 font-mono text-2xl font-bold text-ink-950 sm:text-3xl">
        <p className="break-words rounded-control bg-graphite-100 p-4" data-testid="step-before">
          <span>{parts.prefix}</span>
          <mark className="rounded-control bg-lemon-100 px-1 text-ink-950 ring-2 ring-lemon-500">
            {parts.highlight}
          </mark>
          <span>{parts.suffix}</span>
        </p>

        <div aria-hidden="true" className="text-center text-cobalt-600">
          -&gt;
        </div>

        <p
          aria-label={`After this step: ${parts.after}`}
          className="break-words rounded-control border border-success-100 bg-success-100 p-4 text-success-600"
          data-testid="step-after"
        >
          {parts.after}
        </p>
      </div>

      <p className="text-sm font-semibold text-ink-600">
        Resolve the highlighted part first, then use the new value on the next line.
      </p>
    </section>
  );
}
