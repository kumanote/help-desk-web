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
      minWidth: {
        24: '6rem',
        36: '9rem',
        48: '12rem',
        64: '16rem',
        72: '18rem',
        96: '24rem',
      },
      maxWidth: {
        24: '6rem',
        36: '9rem',
        48: '12rem',
        64: '16rem',
        72: '18rem',
        96: '24rem',
      },
      minHeight: {
        24: '6rem',
        36: '9rem',
        48: '12rem',
        64: '16rem',
        72: '18rem',
        96: '24rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
