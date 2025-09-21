/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'black-gradient': 'linear-gradient(to right, #000000, #434343)',
      },
      colors: {
        'high-priority': '#ef4444',
        'medium-priority': '#f97316',
        'low-priority': '#22c55e',
      },
    },
  },
  plugins: [],
};
