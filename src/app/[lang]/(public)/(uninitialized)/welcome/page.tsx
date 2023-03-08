import { WelcomeForm } from './form'
import { WelcomeHeading } from './heading'

export default async function WelcomePage() {
  return (
    <main className="flex-grow flex flex-col justify-center">
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <WelcomeHeading />
        </div>
        <div className="mt-8 px-2 sm:w-full sm:max-w-md sm:mx-auto">
          <div className="bg-color-sheet py-8 px-4 rounded-lg sm:px-10">
            <WelcomeForm />
          </div>
        </div>
      </div>
    </main>
  )
}
