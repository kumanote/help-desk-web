import clsx from 'clsx'

interface Props {
  circle?: boolean
  className?: string
}

export function Skeleton({ circle, className }: Props) {
  const classes = ['animate-pulse', 'bg-slate-200', 'dark:bg-slate-700']
  if (circle) {
    classes.push('rounded-full')
  } else {
    classes.push('rounded')
  }
  return <div className={clsx(classes, className)}></div>
}
