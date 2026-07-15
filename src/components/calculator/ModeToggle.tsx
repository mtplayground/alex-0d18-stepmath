import type { CalculatorMode } from './calculatorState';

const modeOptions: Array<{ label: string; value: CalculatorMode }> = [
  { label: 'Quick', value: 'quick' },
  { label: 'Guided', value: 'guided' },
];

export type ModeToggleProps = {
  mode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
};

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div
      aria-label="Calculator mode"
      className="grid grid-cols-2 rounded-panel border border-graphite-100 bg-graphite-100 p-1"
      role="group"
    >
      {modeOptions.map((option) => {
        const isSelected = option.value === mode;

        return (
          <button
            aria-pressed={isSelected}
            className={`min-h-touch rounded-control px-4 text-base font-bold transition-colors ${
              isSelected
                ? 'bg-paper text-cobalt-600 shadow-control'
                : 'text-ink-600 hover:bg-paper hover:text-ink-950'
            }`}
            key={option.value}
            onClick={() => onModeChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
