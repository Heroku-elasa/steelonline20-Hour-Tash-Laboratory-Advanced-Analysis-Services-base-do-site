
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'Inter', 'sans-serif'],
      },
      colors: {
        'corp-red': {
          dark: '#7F0031',
          DEFAULT: '#9D003D',
          light: '#D41F5B'
        },
        'corp-teal': {
          dark: '#077E28',
          DEFAULT: '#009787',
          light: '#00D3BD'
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        'corp-blue-dark': '#9D003D', // Alias for rebranding compatibility
        'corp-blue': '#009787', // Alias for rebranding compatibility
        'corp-blue-light': '#00D3BD'
      }
    },
  },
  plugins: [],
}
