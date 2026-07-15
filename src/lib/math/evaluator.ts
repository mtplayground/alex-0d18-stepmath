import type {
  BinaryOperator,
  EvaluationResult,
  EvaluationStep,
  ExpressionNode,
  MathEvaluationError,
  SourceSpan,
  UnaryOperator,
} from './types';

type EvaluatedNode = {
  display: string;
  value: number;
};

type EvaluationContext = {
  nextStep: number;
  trace: EvaluationStep[];
};

class EvaluationFailure extends Error {
  constructor(readonly evaluationError: MathEvaluationError) {
    super(evaluationError.message);
  }
}

function formatNumber(value: number) {
  if (Object.is(value, -0)) {
    return '0';
  }

  return Number.isInteger(value) ? String(value) : String(Number(value.toPrecision(12)));
}

function unsupportedExpression(kind: ExpressionNode['kind'], span: SourceSpan): EvaluationFailure {
  return new EvaluationFailure({
    code: 'unsupported-expression',
    message: `${kind} expressions will be evaluated in a later math module.`,
    span,
  });
}

function divisionByZero(span: SourceSpan): EvaluationFailure {
  return new EvaluationFailure({
    code: 'division-by-zero',
    message: 'Division by zero is not defined.',
    span,
  });
}

function recordStep(
  context: EvaluationContext,
  step: Omit<EvaluationStep, 'id' | 'order'>,
): EvaluationStep {
  const order = context.nextStep;
  context.nextStep += 1;

  const completeStep = {
    ...step,
    id: `step-${order}`,
    order,
  };

  context.trace.push(completeStep);
  return completeStep;
}

function applyUnary(operator: UnaryOperator, operand: number) {
  return operator === '-' ? -operand : operand;
}

function applyBinary(operator: BinaryOperator, left: number, right: number, span: SourceSpan) {
  switch (operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      if (right === 0) {
        throw divisionByZero(span);
      }
      return left / right;
  }
}

function renderBinary(operator: BinaryOperator, left: string, right: string) {
  return `${left} ${operator} ${right}`;
}

function renderUnary(operator: UnaryOperator, operand: string) {
  return `${operator}${operand}`;
}

function evaluateNode(node: ExpressionNode, context: EvaluationContext): EvaluatedNode {
  switch (node.kind) {
    case 'number':
      return {
        display: node.raw,
        value: node.value,
      };

    case 'group':
      return evaluateNode(node.expression, context);

    case 'unary': {
      const operand = evaluateNode(node.operand, context);
      const result = applyUnary(node.operator, operand.value);
      const display = formatNumber(result);

      recordStep(context, {
        after: display,
        before: renderUnary(node.operator, operand.display),
        kind: 'unary',
        operands: [operand.value],
        operator: node.operator,
        result,
        span: node.span,
      });

      return { display, value: result };
    }

    case 'binary': {
      const left = evaluateNode(node.left, context);
      const right = evaluateNode(node.right, context);
      const result = applyBinary(node.operator, left.value, right.value, node.span);
      const display = formatNumber(result);

      recordStep(context, {
        after: display,
        before: renderBinary(node.operator, left.display, right.display),
        kind: 'binary',
        operands: [left.value, right.value],
        operator: node.operator,
        result,
        span: node.span,
      });

      return { display, value: result };
    }

    case 'fraction':
    case 'percentage':
      throw unsupportedExpression(node.kind, node.span);
  }
}

export function evaluateExpressionAst(ast: ExpressionNode): EvaluationResult {
  const context: EvaluationContext = {
    nextStep: 1,
    trace: [],
  };

  try {
    const evaluated = evaluateNode(ast, context);

    return {
      displayValue: evaluated.display,
      ok: true,
      trace: context.trace,
      value: evaluated.value,
    };
  } catch (error) {
    if (error instanceof EvaluationFailure) {
      return {
        errors: [error.evaluationError],
        ok: false,
        trace: context.trace,
      };
    }

    throw error;
  }
}
