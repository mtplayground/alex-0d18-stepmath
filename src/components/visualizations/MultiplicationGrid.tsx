import type { GuidedVisualization } from '../../lib/guided';

type MultiplicationVisualization = Extract<GuidedVisualization, { kind: 'multiplication-grid' }>;

export type MultiplicationGridProps = {
  factors: MultiplicationVisualization['factors'];
  product: number;
  revealedUnits?: number;
};

type GridModel = {
  columns: number;
  rows: number;
  totalUnits: number;
};

const maxGridUnits = 144;

function isPositiveWholeNumber(value: number) {
  return Number.isInteger(value) && value > 0;
}

function createGridModel([leftFactor, rightFactor]: MultiplicationGridProps['factors']) {
  if (!isPositiveWholeNumber(leftFactor) || !isPositiveWholeNumber(rightFactor)) {
    return undefined;
  }

  const rows = leftFactor;
  const columns = rightFactor;
  const totalUnits = rows * columns;

  if (totalUnits > maxGridUnits) {
    return undefined;
  }

  return { columns, rows, totalUnits } satisfies GridModel;
}

function clampRevealedUnits(value: number | undefined, totalUnits: number) {
  if (value === undefined) {
    return totalUnits;
  }

  if (!Number.isFinite(value)) {
    return totalUnits;
  }

  return Math.min(Math.max(Math.floor(value), 0), totalUnits);
}

export function MultiplicationGrid({ factors, product, revealedUnits }: MultiplicationGridProps) {
  const grid = createGridModel(factors);
  const [rows, columns] = factors;

  if (!grid) {
    return (
      <section
        aria-label={`${rows} times ${columns} equals ${product}`}
        className="grid gap-3 rounded-panel border border-cobalt-100 bg-paper p-5 shadow-control"
      >
        <p className="text-eyebrow uppercase text-cobalt-600">Multiplication</p>
        <p className="break-words font-mono text-3xl font-extrabold text-ink-950">
          {rows} x {columns} = {product}
        </p>
        <p className="text-sm font-semibold text-ink-600">
          This multiplication is best shown as a number sentence.
        </p>
      </section>
    );
  }

  const visibleUnits = clampRevealedUnits(revealedUnits, grid.totalUnits);
  const isComplete = visibleUnits === grid.totalUnits;

  return (
    <section
      aria-label={`${grid.rows} rows of ${grid.columns} makes ${grid.totalUnits}`}
      className="grid gap-5 rounded-panel border border-cobalt-100 bg-paper p-5 shadow-control"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-eyebrow uppercase text-cobalt-600">Multiplication grid</p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-ink-950">
            {grid.rows} x {grid.columns} = {product}
          </p>
        </div>
        <p className="rounded-pill bg-cobalt-100 px-3 py-1 text-sm font-bold text-cobalt-600">
          {visibleUnits} of {grid.totalUnits}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div
          aria-hidden="true"
          className="grid min-w-fit gap-2"
          style={{ gridTemplateColumns: `repeat(${grid.columns}, minmax(2rem, 1fr))` }}
        >
          {Array.from({ length: grid.totalUnits }, (_, index) => {
            const isVisible = index < visibleUnits;

            return (
              <span
                className={`aspect-square min-h-8 rounded-control border transition-all duration-300 ${
                  isVisible
                    ? 'border-cobalt-600 bg-cobalt-600 shadow-control'
                    : 'border-graphite-100 bg-graphite-100'
                }`}
                key={`multiplication-cell-${index}`}
              />
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="text-sm font-semibold text-ink-600">
        {isComplete
          ? 'Every unit is filled, so the full product is shown.'
          : 'Each filled square adds one more unit to the product.'}
      </p>
    </section>
  );
}
