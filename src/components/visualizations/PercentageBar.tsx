import type { GuidedVisualization } from '../../lib/guided';

type PercentageVisualization = Extract<GuidedVisualization, { kind: 'percentage-bar' }>;

export type PercentageBarProps = {
  decimal: PercentageVisualization['decimal'];
  filledPortion: PercentageVisualization['filledPortion'];
  percent: PercentageVisualization['percent'];
};

function clampFillPercent(filledPortion: number) {
  if (!Number.isFinite(filledPortion)) {
    return 0;
  }

  return Math.min(Math.max(filledPortion * 100, 0), 100);
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return Number.isInteger(value) ? String(value) : String(Number(value.toPrecision(12)));
}

export function PercentageBar({ decimal, filledPortion, percent }: PercentageBarProps) {
  const fillPercent = clampFillPercent(filledPortion);
  const roundedFill = Math.round(fillPercent);
  const isOverWhole = percent > 100;
  const isUnderZero = percent < 0;

  return (
    <section
      aria-label={`${formatNumber(percent)} percent shown on a filled bar`}
      className="grid gap-5 rounded-panel border border-success-100 bg-paper p-5 shadow-control"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-eyebrow uppercase text-success-600">Percentage bar</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-ink-950">
            {formatNumber(percent)}% = {formatNumber(decimal)}
          </p>
        </div>
        <p className="rounded-pill bg-success-100 px-3 py-1 text-sm font-bold text-success-600">
          {roundedFill}% filled
        </p>
      </div>

      <div className="grid gap-2">
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={roundedFill}
          className="h-12 overflow-hidden rounded-panel border border-graphite-100 bg-graphite-100"
          role="progressbar"
        >
          <div
            className="h-full rounded-control bg-success-600 transition-all duration-500"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-sm font-bold text-ink-600">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="grid gap-3">
        <p className="text-body font-semibold text-ink-800">
          The filled part shows how much of one whole the percent covers.
        </p>
        {isOverWhole ? (
          <p className="rounded-control bg-lemon-100 p-3 text-sm font-bold text-ink-800">
            This percent is more than one whole, so the bar is completely filled.
          </p>
        ) : null}
        {isUnderZero ? (
          <p className="rounded-control bg-coral-100 p-3 text-sm font-bold text-ink-800">
            This percent is below zero, so the bar starts empty.
          </p>
        ) : null}
      </div>
    </section>
  );
}
