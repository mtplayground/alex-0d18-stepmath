import type { ChangeEventHandler } from 'react';

export type CalculatorInputProps = {
  id?: string;
  onChange: (value: string) => void;
  value: string;
};

export function CalculatorInput({
  id = 'calculator-expression',
  onChange,
  value,
}: CalculatorInputProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="grid gap-3">
      <label className="text-eyebrow uppercase text-cobalt-600" htmlFor={id}>
        Expression
      </label>
      <input
        aria-label="Calculator expression"
        autoComplete="off"
        className="min-h-20 w-full rounded-panel border border-graphite-100 bg-paper px-5 text-right font-mono text-4xl font-bold text-ink-950 shadow-control outline-none transition-colors placeholder:text-ink-400 focus:border-aqua-500"
        id={id}
        inputMode="decimal"
        onChange={handleChange}
        placeholder="0"
        spellCheck={false}
        type="text"
        value={value}
      />
    </div>
  );
}
