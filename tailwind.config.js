/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  safelist: [
    'bg-gradient-to-r',
    'from-pink-400',
    'to-pink-600',
    'from-green-400',
    'to-green-600',
    'from-yellow-400',
    'to-yellow-600',
    'from-blue-400',
    'to-blue-600',
    'from-indigo-400',
    'to-indigo-600',
    'from-red-400',
    'to-red-600',
    'from-lime-400',
    'to-lime-600',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui')
  ],
}

