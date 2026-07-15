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
import { CalculatorInput } from './CalculatorInput';
import { CalculatorKeypad } from './CalculatorKeypad';

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
  const [expression, setExpression] = useState('');
  const [messages, setMessages] = useState<FriendlyMathMessage[]>([]);
  const [result, setResult] = useState<string | null>(null);

  function updateExpression(nextValue: string) {
    setExpression(nextValue);
    setMessages([]);
    setResult(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
    <div className="grid gap-6">
      <form className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end" onSubmit={handleSubmit}>
        <CalculatorInput onChange={updateExpression} value={expression} />
        <Button className="min-h-20 px-8" size="lg" type="submit">
          Solve
        </Button>
      </form>

      {result ? (
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

      {messages.length > 0 ? (
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

      <CalculatorKeypad
        onBackspace={() => updateExpression(removeLastInput(expression))}
        onClear={() => updateExpression('')}
        onInput={(key) => updateExpression(appendKey(expression, key))}
      />
    </div>
  );
}
