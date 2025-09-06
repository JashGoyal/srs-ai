/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: '#39FF14',
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%) translateX(-50%)', opacity: '0' },
          '100%': { transform: 'translateY(0) translateX(-50%)', opacity: '1' },
        },
      },
      animation: {
        slideDown: 'slideDown 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
