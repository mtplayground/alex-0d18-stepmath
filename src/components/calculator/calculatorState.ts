import { useCallback, useState } from 'react';

const calculatorModeKey = 'calculator.mode';

export type CalculatorMode = 'quick' | 'guided';

function isCalculatorMode(value: string | null): value is CalculatorMode {
  return value === 'quick' || value === 'guided';
}

function getInitialMode(): CalculatorMode {
  if (typeof window === 'undefined') {
    return 'quick';
  }

  try {
    const storedMode = window.localStorage.getItem(calculatorModeKey);
    return isCalculatorMode(storedMode) ? storedMode : 'quick';
  } catch {
    return 'quick';
  }
}

export function useCalculatorState() {
  const [expression, setExpression] = useState('');
  const [mode, setModeState] = useState<CalculatorMode>(getInitialMode);

  const setMode = useCallback((nextMode: CalculatorMode) => {
    setModeState(nextMode);

    try {
      window.localStorage.setItem(calculatorModeKey, nextMode);
    } catch {
      return;
    }
  }, []);

  return {
    expression,
    mode,
    setExpression,
    setMode,
  };
}
