import { prisma } from '@/lib/prisma'
import { Container } from '@/components/ui/container'
import { Header } from '@/components/ui/header'
import Link from 'next/link'
import { deletePost, publishPost } from '@/app/actions/posts'
import { DeletePostButton } from '@/components/ui/delete-post-button'
import { ru } from '@/lib/i18n/ru'

export default async function DraftsPage() {
  const drafts = await prisma.post.findMany({
    where: { published: false },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-full bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <Header />
      <main className="py-10 sm:py-12">
        <Container>
          <h1 className="text-3xl font-bold text-sky-900 mb-2">{ru.drafts.title}</h1>
          <p className="text-slate-600 mb-8">{ru.drafts.subtitle}</p>

          {drafts.length === 0 ? (
            <p className="rounded-2xl border border-sky-100 bg-white p-6 text-slate-500 shadow-sm">
              {ru.drafts.empty}
            </p>
          ) : (
            <ul className="grid gap-5 sm:gap-6">
              {drafts.map((post) => (
                <li
                  key={post.id}
                  className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm"
                >
                  <h2 className="text-xl font-semibold text-sky-900">{post.title}</h2>
                  <p className="mt-3 text-slate-600 whitespace-pre-wrap">{post.content}</p>
                  <time className="mt-4 block text-sm text-slate-400">
                    {ru.common.createdOn} {new Date(post.createdAt).toLocaleDateString()}
                  </time>
                  <div className="mt-5 flex items-center gap-3">
                    <Link
                      href={`/blog/drafts/${post.id}`}
                      className="inline-flex rounded-lg border border-sky-200 px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50 transition"
                    >
                      {ru.drafts.edit}
                    </Link>
                    <form action={publishPost}>
                      <input type="hidden" name="id" value={post.id} />
                      <button
                        type="submit"
                        className="inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
                      >
                        {ru.drafts.publishNow}
                      </button>
                    </form>
                    <form action={deletePost}>
                      <input type="hidden" name="id" value={post.id} />
                      <DeletePostButton
                        label={ru.common.delete}
                        className="inline-flex rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 transition"
                      />
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </main>
    </div>
  )
}
