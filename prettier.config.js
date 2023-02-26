module.exports = {
  singleQuote: true,
  semi: false,
  tabWidth: 2,
  useTabs: false,
  importOrder: [
    '^@/dictionaries/(.*)$',
    // '^@/images/(.*)$',
    '^@/app/(.*)$',
    '^@/components/(.*)$',
    '^@/hooks/(.*)$',
    '^@/lib/(.*)$',
    '^@/api/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    require('prettier-plugin-tailwindcss'),
    require('@trivago/prettier-plugin-sort-imports'),
  ],
}
