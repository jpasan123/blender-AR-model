/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1f8ad1',
        white: '#ffffff',
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to right bottom, #1f8ad1, #1f8ad1)',
      },
    },
  },
  plugins: [],
};