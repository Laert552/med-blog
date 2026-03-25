'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ru } from '@/lib/i18n/ru'

interface PostEditorFormProps {
  post: {
    id: string
    title: string
    content: string
    published: boolean
  }
  action: (formData: FormData) => Promise<void>
  title: string
  cancelHref: string
  allowPublishToggle: boolean
}

export function PostEditorForm({
  post,
  action,
  title,
  cancelHref,
  allowPublishToggle,
}: PostEditorFormProps) {
  const router = useRouter()
  const [formState, setFormState] = useState({
    title: post.title,
    content: post.content,
    published: post.published,
  })

  const resetForm = () => {
    setFormState({
      title: post.title,
      content: post.content,
      published: post.published,
    })
  }

  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-6 sm:p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-sky-900 mb-8">{title}</h1>
      <form action={action} className="space-y-6">
        <input type="hidden" name="id" value={post.id} />

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1 text-slate-700">
            {ru.forms.titleLabel}
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formState.title}
            onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
            className="w-full border border-sky-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1 text-slate-700">
            {ru.forms.contentLabel}
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={10}
            value={formState.content}
            onChange={(event) => setFormState((prev) => ({ ...prev, content: event.target.value }))}
            className="w-full border border-sky-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {allowPublishToggle && (
          <div className="flex items-center gap-2">
            <input
              id="published"
              name="published"
              type="checkbox"
              checked={formState.published}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, published: event.target.checked }))
              }
              className="h-4 w-4 rounded border-sky-200 text-sky-600 focus:ring-sky-200"
            />
            <label htmlFor="published" className="text-sm font-medium text-slate-700">
              {ru.forms.publishNow}
            </label>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-sky-700 text-white px-6 py-2 rounded-lg hover:bg-sky-800 transition"
          >
            {ru.forms.saveChanges}
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm()
              router.push(cancelHref)
            }}
            className="inline-flex rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            {ru.common.cancel}
          </button>
        </div>
      </form>
    </div>
  )
}
