'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ru } from '@/lib/i18n/ru'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const published = formData.get('published') === 'on'

  if (!title || !content) {
    throw new Error(ru.actions.requiredTitleContent)
  }

  await prisma.post.create({
    data: { title, content, published },
  })

  revalidatePath('/blog')
  revalidatePath('/blog/drafts')
  redirect(published ? '/blog' : '/blog/drafts')
}

export async function publishPost(formData: FormData) {
  const id = formData.get('id') as string

  if (!id) {
    throw new Error(ru.actions.requiredPostId)
  }

  await prisma.post.update({
    where: { id },
    data: { published: true },
  })

  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/blog/drafts')
  redirect('/blog')
}

export async function updateDraft(formData: FormData) {
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const published = formData.get('published') === 'on'

  if (!id || !title || !content) {
    throw new Error(ru.actions.requiredIdTitleContent)
  }

  await prisma.post.update({
    where: { id },
    data: { title, content, published },
  })

  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/blog/drafts')
  revalidatePath(`/blog/${id}`)
  redirect(published ? '/blog' : '/blog/drafts')
}

export async function deletePost(formData: FormData) {
  const id = formData.get('id') as string

  if (!id) {
    throw new Error(ru.actions.requiredPostId)
  }

  await prisma.post.delete({
    where: { id },
  })

  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/blog/drafts')
}

export async function updatePublishedPost(formData: FormData) {
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!id || !title || !content) {
    throw new Error(ru.actions.requiredIdTitleContent)
  }

  await prisma.post.update({
    where: { id },
    data: { title, content, published: true },
  })

  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath(`/blog/${id}`)
  redirect('/blog')
}
