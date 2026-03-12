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
        }
      }
    },
  },
  plugins: [],
}
