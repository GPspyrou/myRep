const { Playfair } = require('next/font/google');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        cormorant: ['var(--font-cormorant)'],
        fira: ['var(--font-fira-code)', 'monospace'],
        roboto: ['var(--font-roboto)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'sans-serif']
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
