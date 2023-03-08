interface Props {
  url?: string | null
  size?: number | string
  name?: string
}

export function AgentAvatar({ url, size, name }: Props) {
  const actualSize = size || 32
  const style = { width: `${actualSize}px`, height: `${actualSize}px` }
  if (url) {
    return (
      <picture>
        <img
          src={url}
          alt={name}
          style={style}
          className="rounded-full object-cover"
        />
      </picture>
    )
  } else {
    return (
      <span
        className="inline-block overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-600"
        style={style}
      >
        <svg
          className="h-full w-full text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </span>
    )
  }
}
