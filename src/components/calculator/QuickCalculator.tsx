import type { FormEvent } from 'react';
import { useState } from 'react';
import {
  evaluateExpressionAst,
  explainMathErrors,
  getExpressionHints,
  parseExpression,
  type FriendlyMathMessage,
} from '../../lib/math';
import { Button } from '../ui';
import { useCalculatorState } from './calculatorState';
import { CalculatorInput } from './CalculatorInput';
import { CalculatorKeypad } from './CalculatorKeypad';
import { ModeToggle } from './ModeToggle';

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

function messageClasses(message: FriendlyMathMessage) {
  return message.severity === 'error'
    ? 'border-coral-100 bg-coral-100 text-ink-950'
    : 'border-lemon-100 bg-lemon-100 text-ink-950';
}

export function QuickCalculator() {
  const { expression, mode, setExpression, setMode } = useCalculatorState();
  const [messages, setMessages] = useState<FriendlyMathMessage[]>([]);
  const [result, setResult] = useState<string | null>(null);

  function updateExpression(nextValue: string) {
    setExpression(nextValue);
    setMessages([]);
    setResult(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === 'guided') {
      setResult(null);
      setMessages([]);
      return;
    }

    const parsed = parseExpression(expression);

    if (!parsed.ok) {
      setMessages(explainMathErrors(parsed.errors));
      setResult(null);
      return;
    }

    const evaluated = evaluateExpressionAst(parsed.ast);

    if (!evaluated.ok) {
      setMessages(explainMathErrors(evaluated.errors));
      setResult(null);
      return;
    }

    setMessages(getExpressionHints(parsed.ast));
    setResult(evaluated.displayValue);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:items-start">
      <div className="grid gap-6">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-[14rem_minmax(0,1fr)] md:items-end">
            <ModeToggle mode={mode} onModeChange={setMode} />
            <CalculatorInput onChange={updateExpression} value={expression} />
          </div>
          {mode === 'quick' ? (
            <Button className="min-h-14 w-full px-8 md:ml-auto md:w-auto" size="lg" type="submit">
              Solve
            </Button>
          ) : null}
        </form>

        {mode === 'quick' && result ? (
          <section
            aria-label="Quick result"
            className="rounded-panel border border-success-100 bg-success-100 p-5"
          >
            <p className="text-eyebrow uppercase text-success-600">Result</p>
            <p className="numeral-display mt-2 break-all text-4xl font-extrabold text-success-600 sm:text-numeral">
              {result}
            </p>
          </section>
        ) : null}

        {mode === 'quick' && messages.length > 0 ? (
          <div className="grid gap-3">
            {messages.map((message) => (
              <section
                aria-live={message.severity === 'error' ? 'assertive' : 'polite'}
                className={`rounded-panel border p-4 ${messageClasses(message)}`}
                key={`${message.code}-${message.title}`}
              >
                <h3 className="text-base font-bold text-ink-950">{message.title}</h3>
                <p className="mt-1 text-body text-ink-800">{message.body}</p>
                <p className="mt-2 text-sm font-semibold text-ink-800">{message.suggestion}</p>
              </section>
            ))}
          </div>
        ) : null}
      </div>

      <div className="lg:sticky lg:top-6">
        <CalculatorKeypad
          onBackspace={() => updateExpression(removeLastInput(expression))}
          onClear={() => updateExpression('')}
          onInput={(key) => updateExpression(appendKey(expression, key))}
        />
      </div>
    </div>
  );
}
