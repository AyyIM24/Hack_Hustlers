/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#F5F5DC', // Beige
          DEFAULT: '#D2B48C', // Tan
          dark: '#3E2723', // Dark Brown
          accent: '#8D6E63', // Muted Brown
          success: '#A5D6A7' // Soft Green
        },
        teal: {
          50: '#E8F5F3',
          100: '#B2DFDB',
          200: '#80CBC4',
          300: '#4DB6AC',
          400: '#26A69A',
          500: '#009688',
          600: '#00897B',
          700: '#00796B',
          800: '#00695C',
          900: '#004D40',
        }
      }
    },
  },
  plugins: [],
}
