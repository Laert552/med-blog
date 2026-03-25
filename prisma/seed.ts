import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.post.createMany({
    data: [
      {
        title: 'Hello World',
        content: 'This is the first published post.',
        published: true,
      },
      {
        title: 'Draft Post',
        content: 'This post is still a draft.',
        published: false,
      },
    ],
  })
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
