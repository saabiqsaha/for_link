/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nba-navy': '#17408B',
        'nba-red': '#C9082A',
        'nba-blue': '#17408B',
        'nba-black': '#333333',
        'nba-white': '#f8f8f8',
        'nba-gold': '#17408B',
        'nba-gold-light': '#2A5DB0',
        'nba-gold-dark': '#0D2456',
        'btn-gold': '#aa914a',
        'btn-gold-light': '#c4ad6c',
        'btn-gold-dark': '#8a744a',
      },
      fontFamily: {
        'sans': ['Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
}