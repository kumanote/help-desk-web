import { LoginForm } from './form'
import { LoginHeading } from './heading'

export default async function LoginPage() {
  return (
    <main className="flex-grow flex flex-col justify-center">
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <LoginHeading />
        </div>
        <div className="mt-8 px-2 sm:w-full sm:mx-auto sm:max-w-md">
          <div className="bg-color-sheet py-8 px-4 rounded-lg sm:px-10">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  )
}
