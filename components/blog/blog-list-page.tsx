import { prisma } from '@/lib/prisma'
import { Header } from '@/components/ui/header'
import { Container } from '@/components/ui/container'
import { PostCard } from '@/components/blog/post-card'
import { ru } from '@/lib/i18n/ru'

export async function BlogListPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-full bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <Header />
      <main className="py-10 sm:py-12">
        <Container>
          <div className="mb-8 sm:mb-10 fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-sky-900">{ru.blogList.title}</h1>
            <p className="mt-2 text-slate-600">{ru.blogList.subtitle}</p>
          </div>

          {posts.length === 0 ? (
            <p className="rounded-2xl glass-card p-6 text-slate-500 fade-in">
              {ru.blogList.empty}
            </p>
          ) : (
            <ul className="grid gap-5 sm:gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  createdAt={post.createdAt}
                />
              ))}
            </ul>
          )}
        </Container>
      </main>
    </div>
  )
}
