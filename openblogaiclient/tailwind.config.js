/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#570df8',
          focus: '#4506cb',
          content: '#ffffff',
        },
        'secondary': {
          DEFAULT: '#f000b8',
          focus: '#bd0091',
          content: '#ffffff',
        },
        'accent': {
          DEFAULT: '#37cdbe',
          focus: '#2aa79b',
          content: '#ffffff',
        },
        'neutral': {
          DEFAULT: '#3d4451',
          focus: '#2a2e37',
          content: '#ffffff',
        },
        'base-100': 'var(--base-100)',
        'base-200': 'var(--base-200)',
        'base-300': 'var(--base-300)',
        'base-content': 'var(--base-content)',
      },
      animation: {
        "theme-transition": "theme-transition 0.3s ease",
      },
    },
  },
  plugins: [],
};

module.exports = config;