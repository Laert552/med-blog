import Link from 'next/link'
import { deletePost } from '@/app/actions/posts'
import { DeletePostButton } from '@/components/ui/delete-post-button'
import { ru } from '@/lib/i18n/ru'

interface PostCardProps {
  id: string
  title: string
  content: string
  createdAt: Date
}

export function PostCard({ id, title, content, createdAt }: PostCardProps) {
  return (
    <li className="rounded-2xl glass-card float-hover p-6 fade-in">
      <Link href={`/blog/${id}`} className="block">
        <h2 className="text-xl font-semibold text-sky-900 hover:text-sky-700">{title}</h2>
      </Link>
      <p className="mt-3 text-slate-600 line-clamp-3">{content}</p>
      <time className="mt-4 block text-sm text-slate-400">
        {new Date(createdAt).toLocaleDateString()}
      </time>
      <form action={deletePost} className="mt-4">
        <input type="hidden" name="id" value={id} />
        <div className="flex items-center gap-3">
          <Link
            href={`/blog/${id}/edit`}
            className="inline-flex rounded-lg border border-sky-200 px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50 transition"
          >
            {ru.common.edit}
          </Link>
          <DeletePostButton
            label={ru.common.delete}
            className="inline-flex rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 transition"
          />
        </div>
      </form>
    </li>
  )
}
