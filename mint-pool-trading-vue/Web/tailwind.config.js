/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'trading-dark': '#1E222D',
        'trading-darker': '#13151A',
        'trading-green': '#26a69a',
        'trading-red': '#ef5350',
      }
    },
  },
  plugins: [],
}