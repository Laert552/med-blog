'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ru } from '@/lib/i18n/ru'

const navItems = [
  { href: '/blog', label: ru.nav.blog, exact: true },
  { href: '/blog/drafts', label: ru.nav.drafts, exact: false },
  { href: '/blog/new', label: ru.nav.newPost, exact: true },
]

export function NavigationBar() {
  const pathname = usePathname()

  return (
    <nav aria-label="Основная навигация" className="mt-3">
      <ul className="flex flex-wrap gap-2">
        {navItems.map((item) => {
          let isActive = false

          if (item.exact) {
            isActive = pathname === item.href
          } else {
            isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          }

          let buttonClass =
            'inline-flex rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 '

          if (isActive) {
            buttonClass +=
              'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-[0_10px_24px_-12px_rgba(2,132,199,0.9)]'
          } else {
            buttonClass +=
              'border border-sky-200/80 bg-white/70 text-sky-800 hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-sm'
          }

          return (
            <li key={item.href}>
              <Link href={item.href} className={buttonClass}>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
