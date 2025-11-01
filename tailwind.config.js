/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          green: {
            light: '#a8c66c',
            DEFAULT: '#539f4a',
            dark: '#439639',
          },
          beige: {
            light: '#F5F5DC',
            DEFAULT: '#F0E68C',
            dark: '#E6D8B5',
          },
          sage: {
            light: '#F0F4EC',
            DEFAULT: '#D7E4BD',
            dark: '#B8C5A6',
          },
          cream: '#FFFEF7',
          ivory: '#FFFFF0',
        },
        neutral: {
          50: '#FFFFFF',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Arvo', 'serif'],
        display: ['Gloria Hallelujah', 'cursive'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}