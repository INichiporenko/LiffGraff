/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      lgg: '1264px',
      xl: '1440px',
    },
    colors: {
      'darkgray': '#737373',
      'darkblue': '#00376B',
      'gray': '#DBDBDB',
      'blue': '#0095F6',
      'white': '#FFFFFF',
      'lightgray': '#FAFAFA',
      'lightblue': '#E8F4FD',
      'purple': '#4D00FF',
      'error': '#FF0000',
      'black': '#000000',
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
    extend: {
      animation: {
        'pulse-short': 'pulse 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [
  ],
}

