import type { Config } from 'tailwindcss';

const config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#16161d',
          800: '#2f3040',
          600: '#595b6f',
        },
        mint: {
          500: '#22c55e',
          100: '#dcfce7',
        },
        sky: {
          500: '#0ea5e9',
          100: '#e0f2fe',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
