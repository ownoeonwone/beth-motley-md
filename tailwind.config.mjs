/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EDF7F6',
          100: '#D4EEEC',
          200: '#A8DDD9',
          300: '#6BC5BF',
          400: '#3AA8A4',
          500: '#238888',
          600: '#1A7272',
          700: '#155E5E',
          800: '#0F4F52',
          900: '#0A3D3F',
          950: '#062A2C',
        },
        lime: {
          50:  '#FBFCE8',
          100: '#F5F8D0',
          200: '#EBF1A6',
          300: '#DDE96F',
          400: '#D1E231',
          500: '#BDD022',
          600: '#9EB82E',
          700: '#7A9423',
          800: '#5E7220',
          900: '#4A5B1E',
        },
        neutral: {
          50:  '#F7F7F5',
          100: '#EBEBEB',
          200: '#D4D4D4',
          300: '#B0B0B0',
          400: '#8B8B8B',
          500: '#6B6B6B',
          600: '#525252',
          700: '#404040',
          800: '#2D2D2D',
          900: '#1A1A1A',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1':      ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h2':      ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h3':      ['1.5rem', { lineHeight: '1.3' }],
        'h4':      ['1.25rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body':    ['1rem', { lineHeight: '1.7' }],
        'small':   ['0.875rem', { lineHeight: '1.6' }],
      },
      maxWidth: {
        'page': '1200px',
      },
      borderRadius: {
        'brand': '0.5rem',
      },
    },
  },
  plugins: [],
};
