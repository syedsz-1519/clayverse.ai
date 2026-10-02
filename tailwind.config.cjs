/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-amber': 'var(--brand-amber)',
        'brand-amber-dark': 'var(--brand-amber-dark)',
        'brand-amber-light': 'var(--brand-amber-light)',
        'brand-charcoal': 'var(--brand-charcoal)',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
      },
    },
  },
};