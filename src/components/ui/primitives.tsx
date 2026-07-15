import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

type Tone = 'neutral' | 'cobalt' | 'aqua' | 'coral' | 'lemon' | 'success';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const buttonVariants = {
  primary:
    'border-cobalt-600 bg-cobalt-600 text-white shadow-raised hover:bg-cobalt-500 active:bg-cobalt-600',
  secondary:
    'border-graphite-100 bg-paper text-ink-950 shadow-control hover:border-cobalt-100 hover:bg-cobalt-100',
  quiet: 'border-transparent bg-transparent text-ink-800 hover:bg-graphite-100',
} as const;

const buttonSizes = {
  sm: 'min-h-10 px-3 text-sm',
  md: 'min-h-touch px-4 text-base',
  lg: 'min-h-12 px-5 text-lead font-bold',
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: keyof typeof buttonSizes;
  variant?: keyof typeof buttonVariants;
};

export function Button({
  className,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center rounded-control border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}

const toneClasses: Record<Tone, string> = {
  neutral: 'border-graphite-100 bg-paper text-ink-950',
  cobalt: 'border-cobalt-100 bg-cobalt-100 text-ink-950',
  aqua: 'border-aqua-100 bg-aqua-100 text-ink-950',
  coral: 'border-coral-100 bg-coral-100 text-ink-950',
  lemon: 'border-lemon-100 bg-lemon-100 text-ink-950',
  success: 'border-success-100 bg-success-100 text-ink-950',
};

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: Tone;
};

export function Card({ className, tone = 'neutral', ...props }: CardProps) {
  return (
    <div
      className={cx('rounded-panel border p-5 shadow-control', toneClasses[tone], className)}
      {...props}
    />
  );
}

export type PanelProps = HTMLAttributes<HTMLElement> & {
  actions?: ReactNode;
  children: ReactNode;
  subtitle?: string;
  title: string;
};

export function Panel({ actions, children, className, subtitle, title, ...props }: PanelProps) {
  return (
    <section
      className={cx(
        'rounded-panel border border-graphite-100 bg-paper p-panel shadow-panel',
        className,
      )}
      {...props}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-title text-ink-950">{title}</h2>
          {subtitle ? <p className="mt-2 max-w-2xl text-body text-ink-600">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 gap-3">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export type NumeralDisplayProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: Exclude<Tone, 'neutral'>;
};

const numeralToneClasses: Record<Exclude<Tone, 'neutral'>, string> = {
  cobalt: 'text-cobalt-600',
  aqua: 'text-aqua-600',
  coral: 'text-coral-600',
  lemon: 'text-lemon-500',
  success: 'text-success-600',
};

export function NumeralDisplay({
  children,
  className,
  tone = 'cobalt',
  ...props
}: NumeralDisplayProps) {
  return (
    <span
      className={cx('numeral-display block text-numeral', numeralToneClasses[tone], className)}
      {...props}
    >
      {children}
    </span>
  );
}
