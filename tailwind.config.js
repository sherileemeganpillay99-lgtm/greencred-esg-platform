/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'standard-blue': '#003A70',
        'standard-light-blue': '#0066CC',
        'standard-green': '#00A651',
        'standard-yellow': '#FFB81C',
        'standard-red': '#E31837',
        'standard-gray': '#666666',
      },
      fontFamily: {
        'standard': ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};