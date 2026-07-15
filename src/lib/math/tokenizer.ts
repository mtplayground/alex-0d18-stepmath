import type { BinaryOperator, MathParseError, SourceSpan, Token, TokenizeResult } from './types';

const operatorMap: Record<string, BinaryOperator> = {
  '+': '+',
  '-': '-',
  '*': '*',
  x: '*',
  X: '*',
  '×': '*',
  '/': '/',
  '÷': '/',
};

function span(start: number, end: number): SourceSpan {
  return { start, end };
}

function isDigit(char: string) {
  return char >= '0' && char <= '9';
}

function isWhitespace(char: string) {
  return /\s/.test(char);
}

function readNumber(input: string, start: number): Token | MathParseError {
  let cursor = start;
  let sawDecimalPoint = false;
  let sawDigit = false;

  while (cursor < input.length) {
    const char = input[cursor];

    if (isDigit(char)) {
      sawDigit = true;
      cursor += 1;
      continue;
    }

    if (char === '.' && !sawDecimalPoint) {
      sawDecimalPoint = true;
      cursor += 1;
      continue;
    }

    break;
  }

  const raw = input.slice(start, cursor);
  const value = Number(raw);

  if (!sawDigit || !Number.isFinite(value)) {
    return {
      code: 'invalid-number',
      message: 'Enter a complete number.',
      span: span(start, cursor),
    };
  }

  return {
    kind: 'number',
    raw,
    span: span(start, cursor),
    value,
  };
}

export function tokenizeExpression(input: string): TokenizeResult {
  const tokens: Token[] = [];
  const errors: MathParseError[] = [];
  let cursor = 0;

  while (cursor < input.length) {
    const char = input[cursor];

    if (isWhitespace(char)) {
      cursor += 1;
      continue;
    }

    if (isDigit(char) || char === '.') {
      const tokenOrError = readNumber(input, cursor);

      if ('kind' in tokenOrError) {
        tokens.push(tokenOrError);
        cursor = tokenOrError.span.end;
      } else {
        errors.push(tokenOrError);
        cursor = Math.max(tokenOrError.span.end, cursor + 1);
      }

      continue;
    }

    if (char in operatorMap) {
      tokens.push({
        kind: 'operator',
        raw: char,
        span: span(cursor, cursor + 1),
        value: operatorMap[char],
      });
      cursor += 1;
      continue;
    }

    if (char === '(') {
      tokens.push({ kind: 'leftParen', raw: char, span: span(cursor, cursor + 1) });
      cursor += 1;
      continue;
    }

    if (char === ')') {
      tokens.push({ kind: 'rightParen', raw: char, span: span(cursor, cursor + 1) });
      cursor += 1;
      continue;
    }

    if (char === '%') {
      tokens.push({ kind: 'percent', raw: char, span: span(cursor, cursor + 1) });
      cursor += 1;
      continue;
    }

    errors.push({
      code: 'invalid-character',
      message: `The character "${char}" is not part of a math expression.`,
      span: span(cursor, cursor + 1),
    });
    cursor += 1;
  }

  tokens.push({ kind: 'eof', raw: '', span: span(input.length, input.length) });

  if (errors.length > 0) {
    return { ok: false, errors, tokens };
  }

  return { ok: true, tokens };
}
