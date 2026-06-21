const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
});

const ARTICLES = [
    {
        title: "The Rise of Super-Intelligence: What's Next for AGI?",
        slug: "rise-of-super-intelligence",
        content: "<p>The landscape of artificial intelligence is shifting faster than ever...</p>",
        section: "AI",
        isPremium: true,
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
        title: "Mediterranean Escapes: The Hidden Gems of the Amalfi Coast",
        slug: "mediterranean-escapes",
        content: "<p>Crystal clear waters and sun-drenched cliffs await those who venture...</p>",
        section: "LIFESTYLE",
        isPremium: false,
        thumbnail: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "Global Summit Reaches Historic Agreement on Climate Action",
        slug: "global-summit-climate",
        content: "<p>Leaders from 190 nations have signed a landmark treaty today...</p>",
        section: "WORLD_NEWS",
        isPremium: false,
        thumbnail: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "Mastering Next.js 15: A Comprehensive Tutorial for Developers",
        slug: "mastering-nextjs-15",
        content: "<p>Tutorial content here with code snippets...</p>",
        section: "AI",
        isPremium: true,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "The Art of Slow Living in a Fast-Paced World",
        slug: "art-of-slow-living",
        content: "<p>In an era of constant connectivity, the concept of slow living is gaining...</p>",
        section: "LIFESTYLE",
        isPremium: true,
        thumbnail: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "New Space Mission to Mars Announced for 2030",
        slug: "mars-mission-2030",
        content: "<p>NASA and partner agencies have unveiled plans for the next phase of...</p>",
        section: "WORLD_NEWS",
        isPremium: false,
        thumbnail: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=1000",
    },
];

async function main() {
    console.log('Start seeding ...');

    // Clear existing data
    await prisma.subscription.deleteMany({});
    await prisma.article.deleteMany({});
    await prisma.user.deleteMany({});

    // Seed Articles
    for (const article of ARTICLES) {
        await prisma.article.create({
            data: article,
        });
    }
    console.log('Articles seeded.');

    // Seed Test User
    // Password: password123
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
        data: {
            name: "Test User",
            email: "user@example.com",
            password: hashedPassword,
        }
    });
    console.log(`Created user: ${user.email} (password123)`);

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
