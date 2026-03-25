import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Container } from '@/components/ui/container'
import { Header } from '@/components/ui/header'
import { updateDraft } from '@/app/actions/posts'
import { PostEditorForm } from '@/components/blog/post-editor-form'
import { ru } from '@/lib/i18n/ru'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditDraftPage({ params }: Props) {
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post || post.published) notFound()

  return (
    <div className="min-h-full bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <Header />
      <main className="py-10 sm:py-12">
        <Container>
          <PostEditorForm
            post={post}
            action={updateDraft}
            title={ru.forms.editDraftTitle}
            cancelHref="/blog/drafts"
            allowPublishToggle={true}
          />
        </Container>
      </main>
    </div>
  )
}
