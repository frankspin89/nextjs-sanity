import Link from 'next/link'
import React from 'react'

import {Translation} from '@/lib/types'

import {i18n} from '../../languages'
import {clean} from './Clean'
import TranslationLinks from './TranslationLinks'

type HeaderProps = {
  translations: Translation[]
  currentLanguage: string
}

export default function Header(props: HeaderProps) {
  const {translations, currentLanguage = i18n.base} = props

  return (
    <header className="">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8 xl:px-16 py-8">
        <h1 className="mr-auto">
          <Link
            href={`/${clean(currentLanguage)}`}
            className="block transition-colors duration-200 font-display font-bold group relative z-0"
          >
            <span className="flex items-center relative z-10 group-hover:text-red-500">
              Payt Sanity Next.js
            </span>
            <span className="pointer-events-none absolute inset-0 rounded-md -my-2 group-hover:scale-110  bg-white opacity-0 group-hover:opacity-100 transition-all duration-200" />
          </Link>
        </h1>
        <TranslationLinks translations={translations} />
      </div>
    </header>
  )
}
