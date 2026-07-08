/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#f0ebe0',
          dark: '#e6ddd0',
          darker: '#d9cfc0',
        },
        forest: {
          DEFAULT: '#1a3328',
          mid: '#2d5a3d',
          light: '#3d7a52',
        },
        text: {
          dark: '#1c1c1c',
          body: '#4a4a4a',
          muted: '#8a7a6a',
        },
        accent: '#c4a882',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-md': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-sm': ['2rem', { lineHeight: '1.2' }],
      },
      letterSpacing: {
        widest: '0.15em',
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        card: '0 2px 16px rgba(28,28,28,0.07)',
        'card-hover': '0 8px 32px rgba(28,28,28,0.12)',
      },
    },
  },
  plugins: [],
}