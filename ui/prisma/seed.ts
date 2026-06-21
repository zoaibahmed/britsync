import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // Cleanup existing data
    await prisma.article.deleteMany()

    // --- LIFESTYLE ARTICLES ---
    const lifestyleArticles = [
        {
            title: 'The Modern Minimalist Home: A Guide to Zen Living',
            slug: 'modern-minimalist-home-zen-living',
            content: '<p>Discover how decluttering your space can declutter your mind. We explore the principles of Zen architecture and how to apply them to modern urban apartments. From natural materials to light manipulation, learn the secrets of a peaceful abode.</p><p>Minimalism isn\'t just about having less; it\'s about making room for more of what matters.</p>',
            section: 'LIFESTYLE',
            isPremium: true,
            thumbnail: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2670&auto=format&fit=crop',
            editorsNote: 'Featured in our Monthly Design Edit.',
            createdAt: new Date('2026-01-28T09:00:00Z'), // Latest (Featured)
        },
        {
            title: 'Culinary Voyages: The Rise of Nordic Fusion',
            slug: 'culinary-voyages-nordic-fusion',
            content: '<p>A deep dive into the new wave of chefs blending traditional Nordic ingredients with Asian techniques. We visit Copenhagen\'s hidden gems.</p>',
            section: 'LIFESTYLE',
            thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop',
        },
        {
            title: 'Digital Detox: Reclaiming Your Attention Span',
            slug: 'digital-detox-reclaiming-attention',
            content: '<p>In an age of constant notifications, silence is the ultimate luxury. Here are 5 strategies to disconnect and reconnect with reality.</p>',
            section: 'LIFESTYLE',
            thumbnail: 'https://images.unsplash.com/photo-1511871893393-82e9c16b81e3?q=80&w=2670&auto=format&fit=crop',
        },
        {
            title: 'Sustainable Fashion: Beyond the Hype',
            slug: 'sustainable-fashion-beyond-hype',
            content: '<p>How to build a capsule wardrobe that lasts a lifetime. We interview industry leaders committed to ethical production.</p>',
            section: 'LIFESTYLE',
            thumbnail: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2670&auto=format&fit=crop',
        },
        {
            title: 'The Art of Slow Travel: Tuscany by Train',
            slug: 'slow-travel-tuscany-train',
            content: '<p>Forget the rush. Experience the rolling hills and vineyards of Italy at a leisurely pace. A visual diary of a summer spent in motion.</p>',
            section: 'LIFESTYLE',
            thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2670&auto=format&fit=crop',
        }
    ]

    // --- AI & TECH ARTICLES ---
    const aiArticles = [
        {
            title: 'Generative AI: The Next Industrial Revolution?',
            slug: 'generative-ai-industrial-revolution',
            content: '<p>Experts debate the economic impact of large language models. Will they replace jobs or create entirely new industries? We analyze the data.</p><p>From coding assistants to automated creative workflows, the landscape of work is shifting rapidly.</p>',
            section: 'AI',
            isPremium: true,
            thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2670&auto=format&fit=crop',
            createdAt: new Date('2026-01-28T10:00:00Z'), // Latest (Featured)
        },
        {
            title: 'Neural Networks 101: A Visual Guide',
            slug: 'neural-networks-visual-guide',
            content: '<p>Understanding the black box. We break down how deep learning models actually "learn" using interactive visualizations.</p>',
            section: 'AI',
            thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2670&auto=format&fit=crop',
        },
        {
            title: 'The Ethics of Autonomous Agents',
            slug: 'ethics-autonomous-agents',
            content: '<p>As AI agents become more independent, who is responsible for their actions? Legal frameworks are struggling to keep up with the pace of innovation.</p>',
            section: 'AI',
            thumbnail: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=2670&auto=format&fit=crop',
        },
        {
            title: 'Quantum Computing: The End of Encryption?',
            slug: 'quantum-computing-encryption-risk',
            content: '<p>With Q-Day approaching, cybersecurity experts are racing to develop post-quantum cryptography. Are we ready?</p>',
            section: 'AI',
            thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop',
        },
        {
            title: 'AI in Healthcare: Diagnosing the Undiagnosable',
            slug: 'ai-healthcare-diagnosis',
            content: '<p>How new algorithms are detecting rare diseases years before traditional methods. Real stories from the cutting edge of medicine.</p>',
            section: 'AI',
            thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2670&auto=format&fit=crop',
        }
    ]

    // --- WORLD NEWS ARTICLES ---
    const worldNewsArticles = [
        {
            title: 'Global Summit 2026: Leaders Agree on Carbon Tax',
            slug: 'global-summit-2026-carbon-tax',
            content: '<p>In a historic turn of events, the G20 nations have unanimously agreed to a unified carbon pricing framework. Implementation begins next quarter.</p><p>Markets reacted positively, with green energy stocks surging to record highs.</p>',
            section: 'WORLD_NEWS',
            isPremium: false,
            thumbnail: 'https://images.unsplash.com/photo-1529101091760-61df6be5f1f9?q=80&w=2670&auto=format&fit=crop',
            createdAt: new Date('2026-01-28T08:30:00Z'), // Latest
        },
        {
            title: 'SpaceX Mars Mission: Launch Window Confirmed',
            slug: 'spacex-mars-mission-window',
            content: '<p>The Starship fleet is fueled and ready. Humanity\'s first crewed mission to the Red Planet is set for typical departure in late 2026.</p>',
            section: 'WORLD_NEWS',
            thumbnail: 'https://images.unsplash.com/photo-1516849841054-03c978c93b4b?q=80&w=2670&auto=format&fit=crop',
        },
        {
            title: 'Economic Shift: Asia-Pacific Outpaces Growth Targets',
            slug: 'economic-shift-asia-pacific-growth',
            content: '<p>New fiscal policies in the region have triggered a manufacturing boom. Analysts predict a shift in global supply chain dominance.</p>',
            section: 'WORLD_NEWS',
            thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop',
        },
        {
            title: 'Urban Rewilding: Paris Turns Green',
            slug: 'urban-rewilding-paris-green',
            content: '<p>The Champs-Élysées has been transformed into a linear forest. A look at the ambitious project to cool the city and return nature to the streets.</p>',
            section: 'WORLD_NEWS',
            thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2670&auto=format&fit=crop',
        },
        {
            title: 'Breakthrough in Fusion Energy Stability',
            slug: 'fusion-energy-stability-breakthrough',
            content: '<p>Scientists at ITER have sustained a plasma reaction for over 24 hours. Limitless clean energy is closer than ever before.</p>',
            section: 'WORLD_NEWS',
            thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2670&auto=format&fit=crop',
        }
    ]

    // Insert All
    const allArticles = [...lifestyleArticles, ...aiArticles, ...worldNewsArticles]

    for (const article of allArticles) {
        await prisma.article.create({
            data: article,
        })
    }

    // --- SITE SETTINGS ---
    await (prisma as any).siteSetting.upsert({
        where: { id: 'global' },
        update: {},
        create: {
            id: 'global',
            breakingNews: 'Global Summit Reaches Historic Agreement on Carbon Tax • New Space Mission to Mars Announced for 2030 • Tech Giant Unveils Revolutionary AGI Model •'
        }
    })

    console.log(`Seeding finished. Created ${allArticles.length} articles and global settings.`)
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
