type KeypadButtonKind = 'digit' | 'operator' | 'utility';

type KeypadButton = {
  ariaLabel: string;
  kind: KeypadButtonKind;
  label: string;
  value?: string;
};

const keypadRows: KeypadButton[][] = [
  [
    { ariaLabel: 'Clear expression', kind: 'utility', label: 'AC' },
    { ariaLabel: 'Open parenthesis', kind: 'operator', label: '(', value: '(' },
    { ariaLabel: 'Close parenthesis', kind: 'operator', label: ')', value: ')' },
    { ariaLabel: 'Percent', kind: 'operator', label: '%', value: '%' },
    { ariaLabel: 'Divide', kind: 'operator', label: '÷', value: '÷' },
  ],
  [
    { ariaLabel: 'Seven', kind: 'digit', label: '7', value: '7' },
    { ariaLabel: 'Eight', kind: 'digit', label: '8', value: '8' },
    { ariaLabel: 'Nine', kind: 'digit', label: '9', value: '9' },
    { ariaLabel: 'Multiply', kind: 'operator', label: '×', value: '×' },
    { ariaLabel: 'Delete last character', kind: 'utility', label: 'Del' },
  ],
  [
    { ariaLabel: 'Four', kind: 'digit', label: '4', value: '4' },
    { ariaLabel: 'Five', kind: 'digit', label: '5', value: '5' },
    { ariaLabel: 'Six', kind: 'digit', label: '6', value: '6' },
    { ariaLabel: 'Subtract', kind: 'operator', label: '-', value: '-' },
    { ariaLabel: 'Decimal point', kind: 'operator', label: '.', value: '.' },
  ],
  [
    { ariaLabel: 'One', kind: 'digit', label: '1', value: '1' },
    { ariaLabel: 'Two', kind: 'digit', label: '2', value: '2' },
    { ariaLabel: 'Three', kind: 'digit', label: '3', value: '3' },
    { ariaLabel: 'Add', kind: 'operator', label: '+', value: '+' },
    { ariaLabel: 'Zero', kind: 'digit', label: '0', value: '0' },
  ],
];

const buttonClasses: Record<KeypadButtonKind, string> = {
  digit: 'border-graphite-100 bg-paper text-ink-950 hover:bg-cobalt-100',
  operator: 'border-cobalt-100 bg-cobalt-100 text-cobalt-600 hover:bg-aqua-100 hover:text-aqua-600',
  utility: 'border-coral-100 bg-coral-100 text-coral-600 hover:bg-paper',
};

export type CalculatorKeypadProps = {
  onBackspace: () => void;
  onClear: () => void;
  onInput: (value: string) => void;
};

export function CalculatorKeypad({ onBackspace, onClear, onInput }: CalculatorKeypadProps) {
  return (
    <div aria-label="Calculator keypad" className="grid gap-3" role="group">
      {keypadRows.map((row, rowIndex) => (
        <div className="grid grid-cols-5 gap-3" key={`keypad-row-${rowIndex}`}>
          {row.map((button) => (
            <button
              aria-label={button.ariaLabel}
              className={`min-h-16 rounded-control border px-2 text-2xl font-bold shadow-control transition-colors active:translate-y-px ${buttonClasses[button.kind]}`}
              key={`${button.label}-${button.ariaLabel}`}
              onClick={() => {
                if (button.label === 'AC') {
                  onClear();
                  return;
                }

                if (button.label === 'Del') {
                  onBackspace();
                  return;
                }

                if (button.value) {
                  onInput(button.value);
                }
              }}
              type="button"
            >
              {button.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
