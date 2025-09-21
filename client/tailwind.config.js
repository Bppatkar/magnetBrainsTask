/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'high-priority': '#ef4444',
        'medium-priority': '#f59e0b',
        'low-priority': '#10b981',
        card: '#1f2937',
      },
    },
  },
  plugins: [],
};
