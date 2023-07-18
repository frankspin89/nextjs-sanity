// 'use client'

// import { usePathname } from 'next/navigation'
// import Link from 'next/link'
// import { i18n } from '@/languages'

// export default function LocaleSwitcher() {
//   const pathName = usePathname()
//   const redirectedPathName = (locale: string) => {
//     if (!pathName) return '/'
//     const segments = pathName.split('/')
//     segments[1] = locale
//     return segments.join('/')
//   }

//   return (
//     <div>
//       <p>Locale switcher:</p>
//       <ul className='flex space-x-4'>
//         {i18n.languages.map((locale) => {
//           return (
//             <li key={locale.id}>
//               <Link href={redirectedPathName(locale.id)}>{locale.title}</Link>
//             </li>
//           )
//         })}
//       </ul>
//     </div>
//   )
// }
"use client"

import { useEffect, useState } from 'react';
import { i18n } from '@/languages'
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LanguageSelector() {
  const [links, setLinks] = useState([]);
  const router = useRouter();
  const pathname = usePathname()


  useEffect(() => {
    const linkElements = document.querySelectorAll('head link[rel="alternate"]');
    const linkList = Array.from(linkElements).map((link) => ({
      href: link.href,
      title: link.title,
    }));
    setLinks(linkList);
  }, []);

  useEffect(() => {
    setLinks(null);
    const linkElements = document.querySelectorAll('head link[rel="alternate"]');
    const linkList = Array.from(linkElements).map((link) => ({
      href: link.href,
      title: link.title,
    }));
    setLinks(linkList);
  }, [pathname]);

  return (
    <div>
      <p>Locale switcher:</p>
      <ul className='flex space-x-4'>
        {i18n.languages.map((locale) => {
          const link = links.find((l) => l.href.includes(`/${locale.id}/`));
          const href = link ? link.href : `/${locale.id}/`;
          return (
            <li key={locale.id}>
              <Link href={href}>{locale.title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}