
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
          dark: '#991B1B', // Deep Industrial Red (Action/Heat)
          DEFAULT: '#DC2626', // Standard Red (Alert/Important)
          light: '#FEE2E2' // Very light red for backgrounds
        },
        'corp-teal': {
          // Rebranding to a supportive Blue/Teal for trust
          dark: '#0F766E',
          DEFAULT: '#0F766E', 
          light: '#CCFBF1'
        },
        'corp-blue': {
           dark: '#1E3A8A', // Navy Blue (Trust/Stability)
           DEFAULT: '#2563EB', // Royal Blue (Tech/Info)
           light: '#DBEAFE' // Light Blue (Air/Openness)
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
        // Aliases for compatibility with existing components
        'corp-blue-dark': '#1E3A8A', 
        'corp-blue-light': '#3B82F6'
      }
    },
  },
  plugins: [],
}
