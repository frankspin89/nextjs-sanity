import { i18n } from '@/languages'
import LocaleSwitcher from '@/app/_components/LocaleSwitcher'
import { headers } from 'next/headers'
import Link from 'next/link'


export default function SiteLayout({
  children,
  params
}: {
    children: React.ReactNode,
    params: { lang: string }
  }) {
  
  return (
    <>
    <header className='bg-slate-100 flex justify-between px-4 py-2'>
      <Link href={`/${params.lang}`}>Site logo</Link>
      <LocaleSwitcher />
    </header>
    {children}
  </>
  )
}
