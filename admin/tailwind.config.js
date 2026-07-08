/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        'cream-dark': '#EBE3D7',
        'cream-darker': '#E0D6C6',
        forest: '#2D5A3E',
        'text-dark': '#1A1A1A',
        'text-body': '#4A4A4A',
        'text-muted': '#8A8A8A',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}