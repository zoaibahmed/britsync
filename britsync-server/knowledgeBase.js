// /**
//  * BritSync Knowledge Base Module
//  * Retrieves relevant context from MongoDB and PostgreSQL databases
//  */

// const mongoose = require('mongoose');
// const { Pool } = require('pg');

// // Import MongoDB models
// const Service = require('./models/Service');
// const Project = require('./models/Project');
// const FAQ = require('./models/FAQ');
// const TeamMember = require('./models/TeamMember');

// // PostgreSQL connection for Articles (from ui project)
// let pgPool = null;

// function initPostgres() {
//     if (!pgPool && process.env.ARTICLES_DATABASE_URL) {
//         pgPool = new Pool({
//             connectionString: process.env.ARTICLES_DATABASE_URL,
//             ssl: { rejectUnauthorized: false }
//         });
//     }
//     return pgPool;
// }

// /**
//  * Get all services for context (with fallback)
//  */
// async function getServices() {
//     try {
//         const services = await Service.find().sort({ order: 1 }).maxTimeMS(5000).lean();
//         return services.map(s => ({
//             title: s.title,
//             type: s.type,
//             description: s.description,
//             detailed_desc: s.detailed_desc,
//             features: s.detailed_features,
//             pricing: s.pricing,
//             process: s.process
//         }));
//     } catch (err) {
//         console.error('Error fetching services:', err.message);
//         // Return fallback data when DB unavailable
//         return [
//             { title: 'Web Development', type: 'main', description: 'Custom websites and web apps' },
//             { title: 'AI Automation', type: 'main', description: 'AI-powered business automation' },
//             { title: 'Mobile Apps', type: 'main', description: 'iOS and Android development' },
//             { title: 'Digital Marketing', type: 'main', description: 'SEO, ads, and social media' }
//         ];
//     }
// }

// /**
//  * Get featured/recent projects
//  */
// async function getProjects(limit = 10) {
//     try {
//         const projects = await Project.find()
//             .sort({ featured: -1, createdAt: -1 })
//             .limit(limit)
//             .maxTimeMS(5000)
//             .lean();
//         return projects.map(p => ({
//             title: p.title,
//             category: p.category,
//             description: p.description,
//             challenge: p.challenge,
//             solution: p.solution,
//             client: p.client,
//             technologies: p.technologies,
//             liveUrl: p.liveUrl
//         }));
//     } catch (err) {
//         console.error('Error fetching projects:', err);
//         return [];
//     }
// }

// /**
//  * Get all FAQs
//  */
// async function getFAQs() {
//     try {
//         const faqs = await FAQ.find().sort({ order: 1 }).maxTimeMS(5000).lean();
//         return faqs.map(f => ({
//             question: f.question,
//             answer: f.answer
//         }));
//     } catch (err) {
//         console.error('Error fetching FAQs:', err);
//         return [];
//     }
// }

// /**
//  * Get team members
//  */
// async function getTeamMembers() {
//     try {
//         const team = await TeamMember.find().sort({ order: 1 }).maxTimeMS(5000).lean();
//         return team.map(t => ({
//             name: t.name,
//             role: t.role,
//             bio: t.bio
//         }));
//     } catch (err) {
//         console.error('Error fetching team:', err);
//         return [];
//     }
// }

// /**
//  * Get latest articles/news from PostgreSQL
//  */
// async function getArticles(section = null, limit = 10) {
//     const pool = initPostgres();
//     if (!pool) {
//         console.log('PostgreSQL not configured for articles');
//         return [];
//     }

//     try {
//         let query = `
//             SELECT id, title, slug, content, section, "isPremium", thumbnail, "editorsNote", "createdAt"
//             FROM "Article"
//         `;
//         const params = [];

//         if (section) {
//             query += ` WHERE section = $1`;
//             params.push(section);
//         }

//         query += ` ORDER BY "createdAt" DESC LIMIT $${params.length + 1}`;
//         params.push(limit);

//         const result = await pool.query(query, params);
//         return result.rows.map(a => ({
//             title: a.title,
//             section: a.section,
//             summary: a.content ? a.content.substring(0, 300) + '...' : '',
//             editorsNote: a.editorsNote,
//             isPremium: a.isPremium,
//             publishedAt: a.createdAt
//         }));
//     } catch (err) {
//         console.error('Error fetching articles:', err);
//         return [];
//     }
// }

// /**
//  * Search articles by keyword
//  */
// async function searchArticles(keyword, limit = 5) {
//     const pool = initPostgres();
//     if (!pool) return [];

//     try {
//         const result = await pool.query(`
//             SELECT title, slug, content, section, "createdAt"
//             FROM "Article"
//             WHERE title ILIKE $1 OR content ILIKE $1
//             ORDER BY "createdAt" DESC
//             LIMIT $2
//         `, [`%${keyword}%`, limit]);

//         return result.rows.map(a => ({
//             title: a.title,
//             section: a.section,
//             summary: a.content ? a.content.substring(0, 200) + '...' : '',
//             publishedAt: a.createdAt
//         }));
//     } catch (err) {
//         console.error('Error searching articles:', err);
//         return [];
//     }
// }

// /**
//  * Build complete knowledge context based on user query intent
//  */
// async function buildKnowledgeContext(userMessage) {
//     const lowerMsg = userMessage.toLowerCase();
//     const context = {
//         services: [],
//         projects: [],
//         faqs: [],
//         team: [],
//         articles: [],
//         relevantInfo: []
//     };

//     // Always include services for context
//     context.services = await getServices();

//     // Include FAQs for common questions
//     context.faqs = await getFAQs();

//     // Check for project/portfolio related queries
//     if (lowerMsg.includes('project') || lowerMsg.includes('portfolio') ||
//         lowerMsg.includes('work') || lowerMsg.includes('case stud')) {
//         context.projects = await getProjects(5);
//     }

//     // Check for team related queries
//     if (lowerMsg.includes('team') || lowerMsg.includes('who') ||
//         lowerMsg.includes('founder') || lowerMsg.includes('people')) {
//         context.team = await getTeamMembers();
//     }

//     // Check for news/article related queries
//     if (lowerMsg.includes('news') || lowerMsg.includes('article') ||
//         lowerMsg.includes('blog') || lowerMsg.includes('latest') ||
//         lowerMsg.includes('read') || lowerMsg.includes('ai news') ||
//         lowerMsg.includes('lifestyle') || lowerMsg.includes('world')) {

//         // Determine section
//         let section = null;
//         if (lowerMsg.includes('ai') || lowerMsg.includes('artificial')) {
//             section = 'AI';
//         } else if (lowerMsg.includes('lifestyle')) {
//             section = 'LIFESTYLE';
//         } else if (lowerMsg.includes('world') || lowerMsg.includes('news')) {
//             section = 'WORLD_NEWS';
//         }

//         context.articles = await getArticles(section, 5);
//     }

//     // Search articles for specific topics
//     const keywords = extractKeywords(userMessage);
//     if (keywords.length > 0 && context.articles.length === 0) {
//         for (const keyword of keywords.slice(0, 2)) {
//             const results = await searchArticles(keyword, 3);
//             context.articles.push(...results);
//         }
//     }

//     return context;
// }

// /**
//  * Extract potential search keywords from message
//  */
// function extractKeywords(message) {
//     const stopWords = ['what', 'how', 'why', 'when', 'where', 'is', 'are', 'the', 'a', 'an',
//         'do', 'does', 'can', 'could', 'would', 'should', 'about', 'your', 'you',
//         'me', 'my', 'i', 'tell', 'show', 'give', 'get', 'have', 'has'];

//     const words = message.toLowerCase()
//         .replace(/[^\w\s]/g, '')
//         .split(/\s+/)
//         .filter(w => w.length > 3 && !stopWords.includes(w));

//     return [...new Set(words)];
// }

// /**
//  * Format context for AI prompt
//  */
// function formatContextForPrompt(context) {
//     let formatted = '';

//     if (context.services.length > 0) {
//         formatted += '\n### BritSync Services:\n';
//         context.services.forEach(s => {
//             formatted += `- **${s.title}** (${s.type}): ${s.description || ''}\n`;
//             if (s.pricing) formatted += `  Pricing: ${s.pricing}\n`;
//         });
//     }

//     if (context.faqs.length > 0) {
//         formatted += '\n### Frequently Asked Questions:\n';
//         context.faqs.forEach(f => {
//             formatted += `Q: ${f.question}\nA: ${f.answer}\n\n`;
//         });
//     }

//     if (context.projects.length > 0) {
//         formatted += '\n### Recent Projects:\n';
//         context.projects.forEach(p => {
//             formatted += `- **${p.title}** (${p.category}): ${p.description || ''}\n`;
//             if (p.technologies) formatted += `  Tech: ${p.technologies.join(', ')}\n`;
//         });
//     }

//     if (context.team.length > 0) {
//         formatted += '\n### Team Members:\n';
//         context.team.forEach(t => {
//             formatted += `- **${t.name}** - ${t.role}: ${t.bio || ''}\n`;
//         });
//     }

//     if (context.articles.length > 0) {
//         formatted += '\n### Latest Articles/News:\n';
//         context.articles.forEach(a => {
//             const date = a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : '';
//             formatted += `- **${a.title}** [${a.section}] ${date}\n  ${a.summary}\n\n`;
//         });
//     }

//     return formatted;
// }

// module.exports = {
//     getServices,
//     getProjects,
//     getFAQs,
//     getTeamMembers,
//     getArticles,
//     searchArticles,
//     buildKnowledgeContext,
//     formatContextForPrompt,
//     initPostgres
// };
