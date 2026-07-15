import type { Config } from 'tailwindcss';

const config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        eyebrow: ['0.75rem', { lineHeight: '1rem', fontWeight: '700' }],
        body: ['1rem', { lineHeight: '1.625rem' }],
        lead: ['1.125rem', { lineHeight: '1.875rem' }],
        title: ['2rem', { lineHeight: '2.375rem', fontWeight: '800' }],
        display: ['3.5rem', { lineHeight: '3.75rem', fontWeight: '850' }],
        numeral: ['4.75rem', { lineHeight: '4.75rem', fontWeight: '850' }],
      },
      borderRadius: {
        control: '0.375rem',
        panel: '0.5rem',
        notebook: '0.5rem',
        pill: '999px',
      },
      spacing: {
        gutter: '1.5rem',
        panel: '2rem',
        touch: '2.75rem',
      },
      colors: {
        canvas: '#f5f7ff',
        paper: '#ffffff',
        gridline: '#dbe4ff',
        ink: {
          950: '#16161d',
          800: '#2f3040',
          600: '#595b6f',
          400: '#85889b',
        },
        graphite: {
          900: '#23252f',
          700: '#4a4d5e',
          100: '#eceef5',
        },
        cobalt: {
          600: '#2563eb',
          500: '#3b82f6',
          100: '#dbeafe',
        },
        aqua: {
          600: '#0891b2',
          500: '#06b6d4',
          100: '#cffafe',
        },
        coral: {
          600: '#e11d48',
          500: '#f43f5e',
          100: '#ffe4e6',
        },
        lemon: {
          500: '#eab308',
          100: '#fef3c7',
        },
        success: {
          600: '#16a34a',
          100: '#dcfce7',
        },
      },
      boxShadow: {
        panel: '0 18px 40px rgba(22, 22, 29, 0.09)',
        control: '0 1px 0 rgba(22, 22, 29, 0.08)',
        raised: '0 10px 24px rgba(37, 99, 235, 0.16)',
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
