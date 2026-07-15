export type SourceSpan = {
  start: number;
  end: number;
};

export type BinaryOperator = '+' | '-' | '*' | '/';
export type UnaryOperator = '+' | '-';

export type Token =
  | {
      kind: 'number';
      raw: string;
      span: SourceSpan;
      value: number;
    }
  | {
      kind: 'operator';
      raw: string;
      span: SourceSpan;
      value: BinaryOperator;
    }
  | {
      kind: 'leftParen' | 'rightParen' | 'percent' | 'eof';
      raw: string;
      span: SourceSpan;
    };

export type MathParseError = {
  code:
    | 'empty-input'
    | 'invalid-character'
    | 'invalid-number'
    | 'expected-expression'
    | 'expected-closing-parenthesis'
    | 'unexpected-token'
    | 'trailing-token';
  message: string;
  span: SourceSpan;
};

export type TokenizeResult =
  | {
      ok: true;
      tokens: Token[];
    }
  | {
      ok: false;
      errors: MathParseError[];
      tokens: Token[];
    };

export type NumberLiteralNode = {
  kind: 'number';
  raw: string;
  span: SourceSpan;
  value: number;
};

export type FractionLiteralNode = {
  denominator: NumberLiteralNode;
  kind: 'fraction';
  numerator: NumberLiteralNode;
  span: SourceSpan;
};

export type PercentageNode = {
  kind: 'percentage';
  span: SourceSpan;
  value: ExpressionNode;
};

export type UnaryOperationNode = {
  kind: 'unary';
  operator: UnaryOperator;
  operand: ExpressionNode;
  span: SourceSpan;
};

export type BinaryOperationNode = {
  kind: 'binary';
  left: ExpressionNode;
  operator: BinaryOperator;
  right: ExpressionNode;
  span: SourceSpan;
};

export type GroupNode = {
  expression: ExpressionNode;
  kind: 'group';
  span: SourceSpan;
};

export type ExpressionNode =
  | BinaryOperationNode
  | FractionLiteralNode
  | GroupNode
  | NumberLiteralNode
  | PercentageNode
  | UnaryOperationNode;

export type ParseResult =
  | {
      ast: ExpressionNode;
      ok: true;
      tokens: Token[];
    }
  | {
      errors: MathParseError[];
      ok: false;
      tokens: Token[];
    };

export type MathEvaluationError = {
  code: 'division-by-zero';
  message: string;
  span: SourceSpan;
};

export type FractionVisualValue = {
  denominator: number;
  filledPortion: number;
  kind: 'fraction';
  numerator: number;
};

export type PercentageVisualValue = {
  decimal: number;
  filledPortion: number;
  kind: 'percentage';
  percent: number;
};

export type EvaluationVisualValue = FractionVisualValue | PercentageVisualValue;

export type EvaluationStep = {
  after: string;
  before: string;
  id: string;
  kind: 'binary' | 'fraction' | 'percentage' | 'unary';
  operands: number[];
  operator: BinaryOperator | UnaryOperator | '%';
  order: number;
  result: number;
  span: SourceSpan;
  visual?: EvaluationVisualValue;
};

export type EvaluationResult =
  | {
      displayValue: string;
      ok: true;
      trace: EvaluationStep[];
      value: number;
      visual?: EvaluationVisualValue;
    }
  | {
      errors: MathEvaluationError[];
      ok: false;
      trace: EvaluationStep[];
    };
