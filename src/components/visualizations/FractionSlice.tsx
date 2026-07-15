import type { GuidedVisualization } from '../../lib/guided';

type FractionVisualization = Extract<GuidedVisualization, { kind: 'fraction-slice' }>;

export type FractionSliceProps = {
  denominator: FractionVisualization['denominator'];
  filledPortion?: number;
  numerator: FractionVisualization['numerator'];
};

type Point = {
  x: number;
  y: number;
};

const center = 50;
const maxSliceParts = 24;
const radius = 44;

function isPositiveWholeNumber(value: number) {
  return Number.isInteger(value) && value > 0;
}

function canRenderSlices(numerator: number, denominator: number) {
  return (
    isPositiveWholeNumber(denominator) &&
    Number.isInteger(numerator) &&
    numerator >= 0 &&
    denominator <= maxSliceParts
  );
}

function clampFilledParts(numerator: number, denominator: number) {
  return Math.min(Math.max(numerator, 0), denominator);
}

function pointOnCircle(angleDegrees: number): Point {
  const radians = ((angleDegrees - 90) * Math.PI) / 180;

  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

function describeSlice(startAngle: number, endAngle: number) {
  const start = pointOnCircle(startAngle);
  const end = pointOnCircle(endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${center} ${center}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

function formatPortion(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return undefined;
  }

  return Number.isInteger(value) ? String(value) : String(Number(value.toPrecision(12)));
}

export function FractionSlice({ denominator, filledPortion, numerator }: FractionSliceProps) {
  const canRender = canRenderSlices(numerator, denominator);
  const portion = formatPortion(filledPortion);

  if (!canRender) {
    return (
      <section
        aria-label={`${numerator} over ${denominator}`}
        className="grid gap-3 rounded-panel border border-aqua-100 bg-paper p-5 shadow-control"
      >
        <p className="text-eyebrow uppercase text-aqua-600">Fraction slices</p>
        <p className="break-words font-mono text-3xl font-extrabold text-ink-950">
          {numerator}/{denominator}
        </p>
        <p className="text-sm font-semibold text-ink-600">
          This fraction is best shown as a number sentence.
        </p>
      </section>
    );
  }

  const filledParts = clampFilledParts(numerator, denominator);
  const sliceAngle = 360 / denominator;
  const isWhole = denominator === 1;
  const isImproper = numerator > denominator;

  return (
    <section
      aria-label={`${filledParts} of ${denominator} equal parts filled`}
      className="grid gap-5 rounded-panel border border-aqua-100 bg-paper p-5 shadow-control"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-eyebrow uppercase text-aqua-600">Fraction slices</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-ink-950">
            {numerator}/{denominator}
          </p>
        </div>
        <p className="rounded-pill bg-aqua-100 px-3 py-1 text-sm font-bold text-aqua-600">
          {filledParts} of {denominator} filled
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(10rem,14rem)_1fr] sm:items-center">
        <svg
          aria-hidden="true"
          className="aspect-square w-full max-w-56 justify-self-center"
          role="img"
          viewBox="0 0 100 100"
        >
          {isWhole ? (
            <circle
              className={filledParts === 1 ? 'fill-aqua-500' : 'fill-graphite-100'}
              cx={center}
              cy={center}
              r={radius}
              stroke="white"
              strokeWidth="2"
            />
          ) : (
            Array.from({ length: denominator }, (_, index) => {
              const isFilled = index < filledParts;
              const startAngle = index * sliceAngle;
              const endAngle = startAngle + sliceAngle;

              return (
                <path
                  className={isFilled ? 'fill-aqua-500' : 'fill-graphite-100'}
                  d={describeSlice(startAngle, endAngle)}
                  key={`fraction-slice-${index}`}
                  stroke="white"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              );
            })
          )}
          <circle
            className="fill-none stroke-ink-950"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth="1.5"
          />
        </svg>

        <div className="grid gap-3">
          <p className="text-body font-semibold text-ink-800">
            The whole is split into {denominator} equal parts. {filledParts} parts are filled.
          </p>
          {portion ? (
            <p className="rounded-control bg-aqua-100 p-3 text-sm font-bold text-aqua-600">
              Value: {portion}
            </p>
          ) : null}
          {isImproper ? (
            <p className="rounded-control bg-lemon-100 p-3 text-sm font-bold text-ink-800">
              This fraction is more than one whole, so this circle shows the first whole filled.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
