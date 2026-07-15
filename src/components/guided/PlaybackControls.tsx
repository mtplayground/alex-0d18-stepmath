import { Button } from '../ui';

export type PlaybackControlsProps = {
  currentIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  isPlaying: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  onTogglePlayback: () => void;
  stepCount: number;
};

export function PlaybackControls({
  currentIndex,
  isFirstStep,
  isLastStep,
  isPlaying,
  onNext,
  onPrevious,
  onReset,
  onTogglePlayback,
  stepCount,
}: PlaybackControlsProps) {
  const hasSteps = stepCount > 0;
  const progress = hasSteps ? ((currentIndex + 1) / stepCount) * 100 : 0;
  const currentStepNumber = hasSteps ? currentIndex + 1 : 0;

  return (
    <section aria-label="Step playback" className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-sm font-bold text-ink-600" role="status">
          Step {currentStepNumber} of {stepCount}
        </p>
        <div className="grid grid-cols-4 gap-2 sm:flex">
          <Button
            aria-label="Go to the previous guided step"
            disabled={!hasSteps || isFirstStep}
            onClick={onPrevious}
            size="sm"
            variant="secondary"
          >
            Back
          </Button>
          <Button
            aria-label={isPlaying ? 'Pause guided step playback' : 'Play guided step playback'}
            disabled={!hasSteps}
            onClick={onTogglePlayback}
            size="sm"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            aria-label="Go to the next guided step"
            disabled={!hasSteps || isLastStep}
            onClick={onNext}
            size="sm"
            variant="secondary"
          >
            Next
          </Button>
          <Button
            aria-label="Restart guided steps"
            disabled={!hasSteps || isFirstStep}
            onClick={onReset}
            size="sm"
            variant="quiet"
          >
            Reset
          </Button>
        </div>
      </div>
      <div
        aria-label="Playback progress"
        aria-valuemax={Math.max(stepCount, 1)}
        aria-valuemin={0}
        aria-valuenow={currentStepNumber}
        className="h-2 overflow-hidden rounded-pill bg-graphite-100"
        role="progressbar"
      >
        <div
          className="h-full rounded-pill bg-cobalt-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}
