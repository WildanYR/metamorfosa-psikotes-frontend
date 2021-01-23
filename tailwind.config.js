const colors = require('tailwindcss/colors')
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors :{
        fuchsia: colors.fuchsia,
        blue: {
         light: '#85d7ff',
         DEFAULT: '#1fb6ff',
         dark: '#009eeb',
         special: '#375e97',
       },
       yellow: {
         special: '#ffbb00',
       },
       orange: {
         special: '#ff7c1f',
       }
      }
    },
  },
  variants: {},
  plugins: [],
}
