import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--c-bg)',
          card: 'var(--c-bg2)',
          subtle: 'var(--c-bg3)',
        },
        text: {
          DEFAULT: 'var(--c-text)',
          secondary: 'var(--c-text2)',
          tertiary: 'var(--c-text3)',
        },
        accent: {
          DEFAULT: 'var(--c-accent)',
          soft: 'var(--c-accent-soft)',
          on: 'var(--c-on-accent)',
        },
        separator: 'var(--c-sep)',
        whatsapp: '#128C7E',
        success: 'var(--c-ok)',
        warning: 'var(--c-warn)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'system-ui',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        subtle: 'var(--sh1)',
        card: 'var(--sh2)',
      },
    },
  },
  plugins: [],
};

export default config;
