import { useState } from 'react';
import { CalculatorInput, CalculatorKeypad } from './components/calculator';
import { Panel } from './components/ui';

const spacedOperators = new Set(['+', '-', '×', '÷']);

function appendKey(current: string, key: string) {
  if (!spacedOperators.has(key)) {
    return `${current}${key}`;
  }

  const trimmed = current.trimEnd();
  return trimmed ? `${trimmed} ${key} ` : key === '-' ? '-' : trimmed;
}

function removeLastInput(value: string) {
  const trimmedEnd = value.trimEnd();

  if (trimmedEnd.length === 0) {
    return '';
  }

  return trimmedEnd.slice(0, -1).trimEnd();
}

export function App() {
  const [expression, setExpression] = useState('');

  return (
    <main className="notebook-grid min-h-screen text-ink-950">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-gutter py-12">
        <Panel title="Calculator">
          <div className="grid gap-6">
            <CalculatorInput onChange={setExpression} value={expression} />
            <CalculatorKeypad
              onBackspace={() => setExpression((current) => removeLastInput(current))}
              onClear={() => setExpression('')}
              onInput={(key) => setExpression((current) => appendKey(current, key))}
            />
          </div>
        </Panel>
      </div>
    </main>
  );
}
