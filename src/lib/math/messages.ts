import type {
  BinaryOperationNode,
  ExpressionNode,
  MathEvaluationError,
  MathParseError,
  SourceSpan,
} from './types';

export type FriendlyMathMessage = {
  body: string;
  code: MathEvaluationError['code'] | MathParseError['code'] | 'order-of-operations';
  severity: 'error' | 'hint';
  span?: SourceSpan;
  suggestion: string;
  title: string;
};

type MathError = MathEvaluationError | MathParseError;

function errorMessage(
  error: MathError,
  title: string,
  body: string,
  suggestion: string,
): FriendlyMathMessage {
  return {
    body,
    code: error.code,
    severity: 'error',
    span: error.span,
    suggestion,
    title,
  };
}

export function explainMathError(error: MathError): FriendlyMathMessage {
  switch (error.code) {
    case 'division-by-zero':
      return errorMessage(
        error,
        'Try a different divisor',
        'Dividing by zero does not make a real number because there is no way to make zero equal groups.',
        'Change the number after the division sign to something other than 0.',
      );

    case 'empty-input':
      return errorMessage(
        error,
        'Start with a number',
        'A math expression needs at least one number before it can be solved.',
        'Try typing something like 8 + 4 or (3 + 2) * 5.',
      );

    case 'invalid-character':
      return errorMessage(
        error,
        'That symbol does not fit here',
        'This calculator understands numbers, +, -, *, /, parentheses, fractions, decimals, and percents.',
        'Remove that symbol or swap it for one of the math signs listed above.',
      );

    case 'invalid-number':
      return errorMessage(
        error,
        'That number needs one more check',
        'A decimal point needs digits with it so the calculator can tell what number you mean.',
        'Try adding a digit, like 0.5 or 3.25.',
      );

    case 'expected-expression':
      return errorMessage(
        error,
        'A number goes here',
        'The expression has a spot where a number or a group in parentheses should be.',
        'Add a number, or put a full expression inside parentheses.',
      );

    case 'expected-closing-parenthesis':
      return errorMessage(
        error,
        'Close the parentheses',
        'One opening parenthesis still needs a matching closing parenthesis.',
        'Add ) after the part that belongs together.',
      );

    case 'unexpected-token':
      return errorMessage(
        error,
        'This part is out of place',
        'The calculator was expecting a number or parentheses at this spot.',
        'Check the signs around this spot and make sure each sign has a number on both sides.',
      );

    case 'trailing-token':
      return errorMessage(
        error,
        'There is an extra piece at the end',
        'The expression was complete before this part, so the last piece does not connect yet.',
        'Remove the extra piece or add a math sign and another number before it.',
      );
  }
}

export function explainMathErrors(errors: MathError[]): FriendlyMathMessage[] {
  return errors.map(explainMathError);
}

function isAddOrSubtract(node: BinaryOperationNode) {
  return node.operator === '+' || node.operator === '-';
}

function isMultiplyOrDivide(node: ExpressionNode) {
  return node.kind === 'binary' && (node.operator === '*' || node.operator === '/');
}

function findPrecedenceHintSpan(node: ExpressionNode): SourceSpan | undefined {
  if (node.kind === 'group') {
    return findPrecedenceHintSpan(node.expression);
  }

  if (node.kind !== 'binary') {
    return undefined;
  }

  if (isAddOrSubtract(node) && (isMultiplyOrDivide(node.left) || isMultiplyOrDivide(node.right))) {
    return node.span;
  }

  return findPrecedenceHintSpan(node.left) ?? findPrecedenceHintSpan(node.right);
}

export function getExpressionHints(ast: ExpressionNode): FriendlyMathMessage[] {
  const precedenceSpan = findPrecedenceHintSpan(ast);

  if (!precedenceSpan) {
    return [];
  }

  return [
    {
      body: 'This expression mixes addition or subtraction with multiplication or division. Multiplication and division are solved first.',
      code: 'order-of-operations',
      severity: 'hint',
      span: precedenceSpan,
      suggestion: 'Use parentheses if you want a different part to be solved first.',
      title: 'Order of operations heads-up',
    },
  ];
}
