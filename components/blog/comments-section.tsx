'use client'

import { FormEvent, useState } from 'react'
import { ru } from '@/lib/i18n/ru'

interface CommentItem {
  id: string
  content: string
  createdAt: string
  likes: number
  dislikes: number
  myReaction: 'LIKE' | 'DISLIKE' | null
}

interface CommentsSectionProps {
  postId: string
  initialComments: CommentItem[]
}

export function CommentsSection({ postId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = content.trim()

    if (!text) {
      setError(ru.comments.validation)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: text }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        setError(data.error ?? ru.comments.error)
        return
      }

      const data = (await response.json()) as { comment: CommentItem }
      setComments((prev) => [data.comment, ...prev])
      setContent('')
    } catch {
      setError(ru.comments.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const reactToComment = async (commentId: string, type: 'LIKE' | 'DISLIKE') => {
    const snapshot = comments

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id !== commentId) return comment

        const next = { ...comment }
        const prevReaction = next.myReaction

        if (prevReaction === type) {
          next.myReaction = null
          if (type === 'LIKE') next.likes = Math.max(0, next.likes - 1)
          else next.dislikes = Math.max(0, next.dislikes - 1)
          return next
        }

        if (prevReaction === 'LIKE') next.likes = Math.max(0, next.likes - 1)
        if (prevReaction === 'DISLIKE') next.dislikes = Math.max(0, next.dislikes - 1)

        if (type === 'LIKE') next.likes += 1
        else next.dislikes += 1

        next.myReaction = type
        return next
      }),
    )

    try {
      const response = await fetch(`/api/comments/${commentId}/reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        setError(data.error ?? ru.comments.reactionError)
        setComments(snapshot)
        return
      }

      const data = (await response.json()) as {
        likes: number
        dislikes: number
        myReaction: 'LIKE' | 'DISLIKE' | null
      }

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likes: data.likes,
                dislikes: data.dislikes,
                myReaction: data.myReaction,
              }
            : comment,
        ),
      )
    } catch {
      setError(ru.comments.reactionError)
      setComments(snapshot)
    }
  }

  return (
    <section className="mt-8 rounded-2xl glass-card p-6 sm:p-8 fade-in">
      <h2 className="text-2xl font-semibold text-sky-900 mb-4">{ru.comments.title}</h2>

      <form onSubmit={submitComment} className="space-y-3">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={4}
          placeholder={ru.comments.inputPlaceholder}
          className="w-full border border-sky-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex rounded-lg btn-dynamic px-4 py-2 text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? ru.comments.submitting : ru.comments.submit}
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {comments.length === 0 ? (
          <p className="text-slate-500">{ru.comments.empty}</p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="rounded-xl border border-sky-100/80 bg-white/75 p-4 float-hover">
              <p className="text-slate-700 whitespace-pre-wrap">{comment.content}</p>
              <time className="mt-2 block text-xs text-slate-400">
                {new Date(comment.createdAt).toLocaleString('ru-RU')}
              </time>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => reactToComment(comment.id, 'LIKE')}
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    comment.myReaction === 'LIKE'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-sky-200 text-sky-700 hover:bg-sky-50'
                  }`}
                >
                  👍 {ru.comments.like} ({comment.likes})
                </button>
                <button
                  type="button"
                  onClick={() => reactToComment(comment.id, 'DISLIKE')}
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    comment.myReaction === 'DISLIKE'
                      ? 'border-rose-300 bg-rose-50 text-rose-700'
                      : 'border-sky-200 text-sky-700 hover:bg-sky-50'
                  }`}
                >
                  👎 {ru.comments.dislike} ({comment.dislikes})
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
