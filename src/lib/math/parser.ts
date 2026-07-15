import type {
  BinaryOperator,
  ExpressionNode,
  MathParseError,
  NumberLiteralNode,
  ParseResult,
  SourceSpan,
  Token,
  UnaryOperator,
} from './types';
import { tokenizeExpression } from './tokenizer';

class ParserFailure extends Error {
  constructor(readonly parseError: MathParseError) {
    super(parseError.message);
  }
}

function combineSpan(start: SourceSpan, end: SourceSpan): SourceSpan {
  return { start: start.start, end: end.end };
}

function parseError(
  code: MathParseError['code'],
  message: string,
  span: SourceSpan,
): ParserFailure {
  return new ParserFailure({ code, message, span });
}

function numberNode(token: Extract<Token, { kind: 'number' }>): NumberLiteralNode {
  return {
    kind: 'number',
    raw: token.raw,
    span: token.span,
    value: token.value,
  };
}

class ExpressionParser {
  private cursor = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): ExpressionNode {
    if (this.current().kind === 'eof') {
      throw parseError('empty-input', 'Enter a math expression.', this.current().span);
    }

    const expression = this.parseAdditive();
    const token = this.current();

    if (token.kind !== 'eof') {
      throw parseError('trailing-token', 'This part does not belong at the end.', token.span);
    }

    return expression;
  }

  private parseAdditive(): ExpressionNode {
    let left = this.parseMultiplicative();

    while (this.matchesOperator('+') || this.matchesOperator('-')) {
      const operator = this.advance() as Extract<Token, { kind: 'operator' }>;
      const right = this.parseMultiplicative();
      left = {
        kind: 'binary',
        left,
        operator: operator.value,
        right,
        span: combineSpan(left.span, right.span),
      };
    }

    return left;
  }

  private parseMultiplicative(): ExpressionNode {
    let left = this.parseUnary();

    while (this.matchesOperator('*') || this.matchesOperator('/')) {
      const operator = this.advance() as Extract<Token, { kind: 'operator' }>;
      const right = this.parseUnary();
      left = {
        kind: 'binary',
        left,
        operator: operator.value,
        right,
        span: combineSpan(left.span, right.span),
      };
    }

    return left;
  }

  private parseUnary(): ExpressionNode {
    if (this.matchesOperator('+') || this.matchesOperator('-')) {
      const operator = this.advance() as Extract<Token, { kind: 'operator' }>;
      const operand = this.parseUnary();
      return {
        kind: 'unary',
        operand,
        operator: operator.value as UnaryOperator,
        span: combineSpan(operator.span, operand.span),
      };
    }

    return this.parsePostfix();
  }

  private parsePostfix(): ExpressionNode {
    let node = this.parsePrimary();

    while (this.current().kind === 'percent') {
      const percent = this.advance();
      node = {
        kind: 'percentage',
        span: combineSpan(node.span, percent.span),
        value: node,
      };
    }

    return node;
  }

  private parsePrimary(): ExpressionNode {
    const token = this.current();

    if (token.kind === 'number') {
      return this.parseNumberOrFraction();
    }

    if (token.kind === 'leftParen') {
      const open = this.advance();
      const expression = this.parseAdditive();
      const close = this.current();

      if (close.kind !== 'rightParen') {
        throw parseError(
          'expected-closing-parenthesis',
          'Close the parentheses before continuing.',
          close.span,
        );
      }

      this.advance();
      return {
        expression,
        kind: 'group',
        span: combineSpan(open.span, close.span),
      };
    }

    if (token.kind === 'eof') {
      throw parseError('expected-expression', 'Add a number or parentheses here.', token.span);
    }

    throw parseError('unexpected-token', 'A number or parentheses should go here.', token.span);
  }

  private parseNumberOrFraction(): ExpressionNode {
    const numerator = this.advance() as Extract<Token, { kind: 'number' }>;
    const slash = this.current();
    const denominator = this.peek();

    if (
      slash.kind === 'operator' &&
      slash.value === '/' &&
      denominator.kind === 'number' &&
      numerator.span.end === slash.span.start &&
      slash.span.end === denominator.span.start
    ) {
      this.advance();
      this.advance();
      const numeratorNode = numberNode(numerator);
      const denominatorNode = numberNode(denominator);

      return {
        denominator: denominatorNode,
        kind: 'fraction',
        numerator: numeratorNode,
        span: combineSpan(numeratorNode.span, denominatorNode.span),
      };
    }

    return numberNode(numerator);
  }

  private matchesOperator(operator: BinaryOperator) {
    const token = this.current();
    return token.kind === 'operator' && token.value === operator;
  }

  private current(): Token {
    return this.tokens[this.cursor];
  }

  private peek(): Token {
    return this.tokens[Math.min(this.cursor + 1, this.tokens.length - 1)];
  }

  private advance(): Token {
    const token = this.current();
    this.cursor = Math.min(this.cursor + 1, this.tokens.length - 1);
    return token;
  }
}

export function parseExpression(input: string): ParseResult {
  const tokenizeResult = tokenizeExpression(input);

  if (!tokenizeResult.ok) {
    return {
      errors: tokenizeResult.errors,
      ok: false,
      tokens: tokenizeResult.tokens,
    };
  }

  try {
    const ast = new ExpressionParser(tokenizeResult.tokens).parse();
    return { ast, ok: true, tokens: tokenizeResult.tokens };
  } catch (error) {
    if (error instanceof ParserFailure) {
      return { errors: [error.parseError], ok: false, tokens: tokenizeResult.tokens };
    }

    throw error;
  }
}
