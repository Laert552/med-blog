import { Container } from '@/components/ui/container'
import { NavigationBar } from '@/components/ui/navigation-bar'
import { ru } from '@/lib/i18n/ru'

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-sky-100/80 bg-white/80 backdrop-blur-md">
      <Container className="py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div
              aria-hidden
              className="med-pulse flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-200 to-emerald-200 shadow-sm"
            >
              <span className="text-sky-800 font-semibold">+</span>
            </div>
            <div>
              <p className="text-xl font-semibold text-sky-900">{ru.common.siteTitle}</p>
              <p className="text-xs text-slate-500">{ru.common.siteSubtitle}</p>
            </div>
          </div>
          <NavigationBar />
        </div>
      </Container>
    </header>
  )
}
