/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7f9',
          100: '#d9ecf0',
          200: '#b7dce4',
          300: '#86c4d3',
          400: '#4ea4bc',
          500: '#3488a0',
          600: '#2c6e84',
          700: '#285a6d',
          800: '#264b5b',
          900: '#1b3644', // Matches the deep teal in the SCOLARIS PDF cover!
          950: '#11222c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
