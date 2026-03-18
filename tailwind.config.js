/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        gold: {
          50:  '#FFFBF0',
          100: '#FFF3CC',
          200: '#FFE080',
          300: '#FFD14D',
          400: '#FFC107',
          500: '#E6A800',
          600: '#B37F00',
          700: '#7A5500',
          800: '#3D2A00',
          900: '#1A1200',
        },
        surface: {
          DEFAULT: '#0A0A0A',
          1: '#111111',
          2: '#181818',
          3: '#202020',
          4: '#2A2A2A',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: [],
}
