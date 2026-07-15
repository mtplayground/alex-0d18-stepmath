import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GuidedStep } from '../../lib/guided';

const defaultPlaybackDelayMs = 1400;

export type StepPlaybackState = {
  currentIndex: number;
  currentStep: GuidedStep | undefined;
  goToStep: (index: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isPlaying: boolean;
  nextStep: () => void;
  pause: () => void;
  play: () => void;
  previousStep: () => void;
  reset: () => void;
  stepCount: number;
  togglePlayback: () => void;
};

function clampStepIndex(index: number, stepCount: number) {
  if (stepCount === 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), stepCount - 1);
}

export function useStepPlayback(
  steps: GuidedStep[],
  playbackDelayMs = defaultPlaybackDelayMs,
): StepPlaybackState {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const stepCount = steps.length;

  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [steps]);

  const goToStep = useCallback(
    (index: number) => {
      setCurrentIndex(clampStepIndex(index, stepCount));
      setIsPlaying(false);
    },
    [stepCount],
  );

  const nextStep = useCallback(() => {
    setCurrentIndex((index) => clampStepIndex(index + 1, stepCount));
    setIsPlaying(false);
  }, [stepCount]);

  const previousStep = useCallback(() => {
    setCurrentIndex((index) => clampStepIndex(index - 1, stepCount));
    setIsPlaying(false);
  }, [stepCount]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (stepCount > 0) {
      setIsPlaying(true);
    }
  }, [stepCount]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying((playing) => (stepCount > 0 ? !playing : false));
  }, [stepCount]);

  useEffect(() => {
    if (!isPlaying || stepCount === 0) {
      return;
    }

    if (currentIndex >= stepCount - 1) {
      setIsPlaying(false);
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => {
        const nextIndex = clampStepIndex(index + 1, stepCount);

        if (nextIndex >= stepCount - 1) {
          setIsPlaying(false);
        }

        return nextIndex;
      });
    }, playbackDelayMs);

    return () => window.clearInterval(intervalId);
  }, [currentIndex, isPlaying, playbackDelayMs, stepCount]);

  return useMemo(
    () => ({
      currentIndex,
      currentStep: steps[currentIndex],
      goToStep,
      isFirstStep: currentIndex === 0,
      isLastStep: stepCount === 0 || currentIndex >= stepCount - 1,
      isPlaying,
      nextStep,
      pause,
      play,
      previousStep,
      reset,
      stepCount,
      togglePlayback,
    }),
    [
      currentIndex,
      goToStep,
      isPlaying,
      nextStep,
      pause,
      play,
      previousStep,
      reset,
      stepCount,
      steps,
      togglePlayback,
    ],
  );
}
