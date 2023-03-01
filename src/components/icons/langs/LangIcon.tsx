import { Lang } from '@/lib/language'

import { EnIcon } from './EnIcon'
import { JaIcon } from './JaIcon'
import { ViIcon } from './ViIcon'

interface Props {
  lang?: Lang
  className?: string
}

export function LangIcon({ lang, className, ...props }: Props) {
  switch (lang) {
    case 'vi':
      return <ViIcon className={className} {...props}></ViIcon>
    case 'ja':
      return <JaIcon className={className} {...props}></JaIcon>
    default:
      return <EnIcon className={className} {...props}></EnIcon>
  }
}
