import { AUTHOR } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-color-base">
      <div className="container overflow-hidden py-6 sm:py-8">
        <p className="text-center text-xs leading-5 text-color-dimmed">
          &copy; 2023 {AUTHOR}
        </p>
      </div>
    </footer>
  )
}
