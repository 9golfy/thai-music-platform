import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './components-regist/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00B050',
        'background-light': '#f6f8f6',
        'background-dark': '#112111',
        'neutral-light': '#f0f4f0',
        'neutral-dark': '#1a2a1a',
        'neutral-border': '#e1e8e1',
      },
      fontFamily: {
        sans: ['Public Sans', 'Sarabun', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
