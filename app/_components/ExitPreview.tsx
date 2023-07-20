import Link from 'next/link'

export function ExitPreview() {
  return (
    <div className="bg-red-200 py-4 text-center px-4 flex items-center justify-center space-x-4">
      <span>
        Draft/preview mode on
      </span>
      <Link href="/api/exit-preview" className='bg-white rounded-md px-2 py-1'>Exit preview mode</Link>
    </div>
  )
}