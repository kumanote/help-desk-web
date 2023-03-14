/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      // default font family
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: ({ colors }) => ({
        primary: colors.sky,
      }),
      maxWidth: {
        72: '18rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
