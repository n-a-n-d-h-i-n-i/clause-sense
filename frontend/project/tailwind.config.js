/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'parchment': '#F8F5E9',
        'navy-dark': '#0A1A33',
        'gold-accent': '#C89B3C',
        'clause-highlight': 'rgba(200, 155, 60, 0.15)',
      },
      fontFamily: {
        'serif': ['Merriweather', 'serif'],
        'sans': ['Open Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'highlight-flash': 'highlightFlash 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        highlightFlash: {
          '0%': { backgroundColor: 'rgba(200, 155, 60, 0.3)' },
          '50%': { backgroundColor: 'rgba(200, 155, 60, 0.6)' },
          '100%': { backgroundColor: 'rgba(200, 155, 60, 0.15)' },
        },
      },
    },
  },
  plugins: [],
};