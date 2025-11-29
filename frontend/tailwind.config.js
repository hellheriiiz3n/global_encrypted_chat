/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        telegram: {
          blue: '#3390ec',
          'blue-hover': '#2d7fd9',
          'blue-light': '#e3f2fd',
          background: '#ffffff',
          'background-secondary': '#f0f0f0',
          text: '#000000',
          'text-secondary': '#707579',
          border: '#e4e4e4',
        },
      },
    },
  },
  plugins: [],
}

