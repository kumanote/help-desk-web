module.exports = {
  singleQuote: true,
  semi: false,
  tabWidth: 2,
  useTabs: false,
  importOrder: [
    // '^@/locales/(.*)$',
    // '^@/images/(.*)$',
    // '^@/components/(.*)$',
    '^@/app/(.*)$',
    '^@/pages/(.*)$',
    // '^@/hooks/(.*)$',
    '^@/lib/(.*)$',
    '^@/api/(.*)$',
    // '^@/store/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    require('prettier-plugin-tailwindcss'),
    require('@trivago/prettier-plugin-sort-imports'),
  ],
}
