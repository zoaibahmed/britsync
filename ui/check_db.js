const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  })
  console.log(articles.map(a => ({ title: a.title, thumbnail: a.thumbnail })))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
