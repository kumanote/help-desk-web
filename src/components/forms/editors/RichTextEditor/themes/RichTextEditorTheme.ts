import { EditorThemeClasses } from 'lexical'

const theme: EditorThemeClasses = {
  ltr: 'text-left',
  rtl: 'text-right',
  paragraph: 'text-slate-700 dark:text-slate-200 leading-tight',
  quote:
    'pl-4 border-l-2 text-slate-400 dark:text-slate-500 border-slate-400 dark:border-slate-500',
  heading: {
    h1: 'text-4xl font-extrabold leading-tight tracking-tighter',
    h2: 'text-3xl font-extrabold leading-tight tracking-tighter',
    h3: 'text-3xl font-bold leading-tight',
    h4: 'text-2xl font-bold leading-snug tracking-tight',
    h5: 'text-xl font-bold leading-snug tracking-tight',
    h6: 'text-lg font-bold leading-snug tracking-tight',
  },
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal pl-4',
    ul: 'list-disc pl-4',
    listitem: 'px-2',
  },
  image: 'cursor-default inline-block relative select-none',
  link: 'text-primary-500 hover:text-primary-400 dark:hover:text-primary-600 underline',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: '[text-decoration:underline_line-through]',
    code: 'bg-zinc-100 dark:bg-zinc-700 px-1 py-0.5 text-sm',
  },
  code:
    'relative block bg-zinc-100 dark:bg-zinc-700 pt-2 pr-2 pb-2 pl-14 text-sm my-2 overflow-x-auto whitespace-pre-wrap' +
    ' before:content-[attr(data-gutter)] before:absolute before:left-0 before:top-0 before:w-12 before:py-2 before:pr-2 before:border-r before:border-zinc-300 dark:before:border-zinc-600 before:text-right' +
    ' before:bg-zinc-50 dark:before:bg-zinc-800 before:text-gray-400 dark:before:text-gray-500',
  codeHighlight: {
    atrule: 'text-indigo-600 dark:text-indigo-400',
    attr: 'text-indigo-600 dark:text-indigo-400',
    boolean: 'text-pink-600 dark:text-pink-400',
    builtin: 'text-green-600 dark:text-green-400',
    cdata: 'text-slate-600 dark:text-slate-400',
    char: 'text-green-600 dark:text-green-400',
    class: 'text-red-600 dark:text-red-400',
    'class-name': 'text-red-600 dark:text-red-400',
    comment: 'text-slate-600 dark:text-slate-400',
    constant: 'text-pink-600 dark:text-pink-400',
    deleted: 'text-pink-600 dark:text-pink-400',
    doctype: 'text-slate-600 dark:text-slate-400',
    entity: 'text-amber-800 dark:text-amber-200',
    function: 'text-red-600 dark:text-red-400',
    important: 'text-yellow-600 dark:text-yellow-400',
    inserted: 'text-green-600 dark:text-green-400',
    keyword: 'text-indigo-600 dark:text-indigo-400',
    namespace: 'text-yellow-600 dark:text-yellow-400',
    number: 'text-pink-600 dark:text-pink-400',
    operator: 'text-amber-800 dark:text-amber-200',
    prolog: 'text-slate-600 dark:text-slate-400',
    property: 'text-pink-600 dark:text-pink-400',
    punctuation: 'text-gray-500',
    regex: 'text-yellow-600 dark:text-yellow-400',
    selector: 'text-green-600 dark:text-green-400',
    string: 'text-green-600 dark:text-green-400',
    symbol: 'text-pink-600 dark:text-pink-400',
    tag: 'text-pink-600 dark:text-pink-400',
    url: 'text-amber-800 dark:text-amber-200',
    variable: 'text-yellow-600 dark:text-yellow-400',
  },
}

export default theme
