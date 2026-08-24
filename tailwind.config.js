/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: { 200: '#ffd7a8' },
        green: { 200: '#b9f8cf' },
        teal: { 200: '#96f7e4' },
        cyan: { 200: '#a2f4fd' },
        blue: { 50: '#839cb5', 300: '#90c5ff', 400: '#54a2ff' },
        violet: { 200: '#ddd6ff' },
        gray: { 50: '#f9fafb', 200: '#e5e7eb' },
        'white-50': '#d9ecff',
        'black-50': '#1c1c21',
        'black-100': '#0e0e10',
        'black-200': '#282732',
      },
      fontSize: {
        xs: ['0.75rem', '1.33333'],
        sm: ['0.875rem', '1.42857'],
        base: ['1rem', '1.5'],
        lg: ['1.125rem', '1.55556'],
        xl: ['1.25rem', '1.4'],
        '2xl': ['1.5rem', '1.33333'],
        '3xl': ['1.875rem', '1.2'],
        '4xl': ['2.25rem', '1.11111'],
        '5xl': ['3rem', '1'],
        '6xl': ['3.75rem', '1'],
        '7xl': ['4.5rem', '1'],
        '8xl': ['6rem', '1'],
        '9xl': ['8rem', '1'],
      },
      fontFamily: {
        'yeseva-one': ['Yeseva One', 'serif'],
      },
      keyframes: {
        wiggle: {
          '0%, 10%': { transform: 'rotate(-2.5deg)' },
          '5%': { transform: 'rotate(2.5deg)' },
          '15%, 100%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 2.5s ease-in-out infinite',
      },
      transitionDuration: {
        400: '400ms',
      },
      spacing: {
        15: '3.75rem',
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
        50: '12.5rem',
        70: '17.5rem',
      },
      lineHeight: {
        11: '2.75rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      rotate: {
        20: '20deg',
        60: '60deg',
        65: '65deg',
        120: '120deg',
      },
      zIndex: {
        90: '90',
        100: '100',
      },
    },
  },
  plugins: [],
};
