import Link from 'next/link'

export function ExitPreview() {
  return (
    <div className="bg-red-200 py-2 text-center px-4 flex items-center justify-center space-x-3 text-xs">
      <span>
        Draft/preview mode on
      </span>
      <Link href="/api/exit-preview" className='bg-white rounded-md px-2 py-1'>Exit preview</Link>
    </div>
  )
}