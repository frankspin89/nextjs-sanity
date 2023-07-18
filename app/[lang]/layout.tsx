import './globals.css'
import { Inter } from 'next/font/google'
import { i18n } from '@/languages'
import LocaleSwitcher from '@/app/_components/LocaleSwitcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export async function generateStaticParams() {
  return i18n.languages.map((locale) => ({ lang: locale.id }))
}

export default function RootLayout({
  children,
  params
}: {
    children: React.ReactNode,
    params: { lang: string }
  }) {
  
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
