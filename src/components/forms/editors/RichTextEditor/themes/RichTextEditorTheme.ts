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
  },
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal pl-4',
    ul: 'list-disc pl-4',
    listitem: 'px-2',
  },
  // image: '',
  link: 'text-primary-500 hover:text-primary-400 dark:hover:text-primary-600 underline',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: '[text-decoration:underline_line-through]',
    code: 'bg-zinc-100 dark:bg-zinc-700 px-1 py-0.5 text-sm',
  },
}

export default theme
