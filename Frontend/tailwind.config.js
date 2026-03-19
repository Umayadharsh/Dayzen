/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brown: {
          50:  '#fdf8f3',
          100: '#f5e9d9',
          200: '#e8cfa8',
          300: '#d4a96a',
          400: '#b8823a',
          500: '#8b5e2e',
          600: '#6b4522',
          700: '#4e3018',
          800: '#321e0e',
          900: '#1a0f05',
        },
        cream: '#fefaf5',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['DM Sans', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'slide-up':   'slideUp 0.3s ease',
        'fade-in':    'fadeIn 0.4s ease',
        'scale-in':   'scaleIn 0.2s ease',
      },
      keyframes: {
        slideUp:  { '0%': { transform: 'translateY(12px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn:   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        scaleIn:  { '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' } },
      }
    }
  },
  plugins: []
};