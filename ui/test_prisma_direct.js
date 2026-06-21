
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        const count = await prisma.article.count()
        console.log('Connection successful! Total articles:', count)
        const settings = await prisma.siteSetting.findUnique({ where: { id: 'global' } })
        console.log('Site settings found:', !!settings)
    } catch (e) {
        console.error('Connection failed:', e.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
