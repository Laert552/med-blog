import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ReactionType } from '@prisma/client'

interface RouteContext {
  params: Promise<{ id: string }>
}

async function getOrSetVoterId() {
  const store = await cookies()
  const existing = store.get('comment_reactor_id')?.value
  if (existing) return existing

  const created = crypto.randomUUID()
  store.set('comment_reactor_id', created, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
  return created
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = (await request.json()) as { type?: 'LIKE' | 'DISLIKE' }

  if (!body.type || (body.type !== 'LIKE' && body.type !== 'DISLIKE')) {
    return NextResponse.json({ error: 'Неверный тип реакции.' }, { status: 400 })
  }

  const voterId = await getOrSetVoterId()
  const incomingType = body.type as ReactionType

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      reactions: true,
    },
  })

  if (!comment) {
    return NextResponse.json({ error: 'Комментарий не найден.' }, { status: 404 })
  }

  const existing = comment.reactions.find((reaction) => reaction.voterId === voterId)

  if (!existing) {
    await prisma.commentReaction.create({
      data: {
        commentId: id,
        voterId,
        type: incomingType,
      },
    })
  } else if (existing.type === incomingType) {
    await prisma.commentReaction.delete({
      where: { id: existing.id },
    })
  } else {
    await prisma.commentReaction.update({
      where: { id: existing.id },
      data: { type: incomingType },
    })
  }

  const refreshed = await prisma.comment.findUnique({
    where: { id },
    include: { reactions: true },
  })

  if (!refreshed) {
    return NextResponse.json({ error: 'Комментарий не найден.' }, { status: 404 })
  }

  const likes = refreshed.reactions.filter((reaction) => reaction.type === 'LIKE').length
  const dislikes = refreshed.reactions.filter((reaction) => reaction.type === 'DISLIKE').length
  const myReaction = refreshed.reactions.find((reaction) => reaction.voterId === voterId)?.type ?? null

  return NextResponse.json({ likes, dislikes, myReaction })
}
