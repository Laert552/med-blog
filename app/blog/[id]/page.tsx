import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/ui/container'
import { Header } from '@/components/ui/header'
import { CommentsSection } from '@/components/blog/comments-section'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: Props) {
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          reactions: true,
        },
      },
    },
  })

  if (!post || !post.published) notFound()

  return (
    <div className="min-h-full bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <Header />
      <main className="py-10 sm:py-12">
        <Container>
          <article className="rounded-2xl border border-sky-100 bg-white p-6 sm:p-8 shadow-sm">
            <h1 className="text-3xl sm:text-4xl font-bold text-sky-900 mb-4">{post.title}</h1>
            <time className="text-sm text-slate-400 block mb-8">
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
            <div className="prose prose-slate max-w-none">
              <p>{post.content}</p>
            </div>
          </article>
          <CommentsSection
            postId={post.id}
            initialComments={post.comments.map((comment) => ({
              id: comment.id,
              content: comment.content,
              createdAt: comment.createdAt.toISOString(),
              likes: comment.reactions.filter((reaction) => reaction.type === 'LIKE').length,
              dislikes: comment.reactions.filter((reaction) => reaction.type === 'DISLIKE').length,
              myReaction: null,
            }))}
          />
        </Container>
      </main>
    </div>
  )
}
