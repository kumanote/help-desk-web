import { XCircleIcon } from '@heroicons/react/20/solid'

interface Props {
  errors: Array<string>
}

export function AlertErrors({ errors }: Props) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <div className="text-sm text-red-700">
            <ul className="list-disc space-y-1 pl-5">
              {errors.map((error, index) => {
                return <li key={index}>{error}</li>
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
