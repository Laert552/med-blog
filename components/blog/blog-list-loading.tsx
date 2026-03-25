import { Container } from '@/components/ui/container'
import { Header } from '@/components/ui/header'

export function BlogListLoading() {
  return (
    <div className="min-h-full bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <Header />
      <main className="py-10 sm:py-12">
        <Container>
          <div className="mb-8 sm:mb-10">
            <div className="h-8 w-64 rounded shimmer-line" />
            <div className="mt-3 h-4 w-80 rounded shimmer-line" />
          </div>
          <ul className="grid gap-5 sm:gap-6">
            {[1, 2, 3].map((item) => (
              <li
                key={item}
                className="rounded-2xl glass-card p-6"
              >
                <div className="h-6 w-2/3 rounded shimmer-line" />
                <div className="mt-4 h-4 w-full rounded shimmer-line" />
                <div className="mt-2 h-4 w-5/6 rounded shimmer-line" />
                <div className="mt-5 h-3 w-24 rounded shimmer-line" />
              </li>
            ))}
          </ul>
        </Container>
      </main>
    </div>
  )
}
