/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'charcoal': '#0F172A',
          'slate': '#475569',
          'sand': '#F4EFE6',
          'amber': '#E07A5F',
        }
      },
      fontFamily: {
        'sans': ['system-ui', 'sans-serif'],
        'display': ['system-ui', 'sans-serif'],
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
      }
    },
  },
  plugins: [],
}
