'use client'

import { useEffect } from 'react'

interface Props {
  error: Error
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // TODO Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html>
      <head></head>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
