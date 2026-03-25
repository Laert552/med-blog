import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ru } from '@/lib/i18n/ru'
import { cookies } from 'next/headers'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const cookieStore = await cookies()
  const voterId = cookieStore.get('comment_reactor_id')?.value ?? null

  const comments = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: 'desc' },
    include: {
      reactions: {
        select: {
          voterId: true,
          type: true,
        },
      },
    },
  })

  return NextResponse.json({
    comments: comments.map((comment) => {
      const likes = comment.reactions.filter((reaction) => reaction.type === 'LIKE').length
      const dislikes = comment.reactions.filter((reaction) => reaction.type === 'DISLIKE').length
      const myReaction = voterId
        ? (comment.reactions.find((reaction) => reaction.voterId === voterId)?.type ?? null)
        : null

      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        likes,
        dislikes,
        myReaction,
      }
    }),
  })
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = (await request.json()) as { content?: string }
  const content = body.content?.trim() ?? ''

  if (!content) {
    return NextResponse.json(
      { error: ru.comments.validation },
      {
        status: 400,
      },
    )
  }

  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, published: true },
  })

  if (!post || !post.published) {
    return NextResponse.json({ error: 'Пост не найден.' }, { status: 404 })
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId: id,
    },
  })

  return NextResponse.json(
    {
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        likes: 0,
        dislikes: 0,
        myReaction: null,
      },
    },
    { status: 201 },
  )
}
