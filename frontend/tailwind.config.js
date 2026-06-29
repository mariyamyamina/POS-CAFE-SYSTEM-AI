/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        text: {
          DEFAULT: '#2F3470',
          50: '#F8F8FB',
          100: '#EEF0F6',
          200: '#DEE2EC',
          300: '#B8BCC8',
          400: '#8A8FA8',
          500: '#6E768E',
          600: '#4D45A4',
          700: '#2F3470',
          800: '#1A1D3A',
          900: '#10112B',
        },
      },
    },
  },
  plugins: [],
}
