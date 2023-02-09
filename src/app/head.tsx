import { APP_DESK, APP_NAME } from '@/lib/constants'

export default function Head() {
  return (
    <>
      <title>{APP_NAME}</title>
      <meta
        content="minimum-scale=1,maximum-scale=1,width=device-width, initial-scale=1"
        name="viewport"
      />
      <meta property="format-detection" content="telephone=no" />
      <meta name="description" content={APP_DESK} />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </>
  )
}
