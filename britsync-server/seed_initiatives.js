const mongoose = require('mongoose');
require('dotenv').config();
const Initiative = require('./models/Initiative');

const initiativesData = [
  {
    type: 'global',
    title: 'Global AI Olympiad',
    description: 'Building the sovereign digital infrastructure for global competitive excellence and AI research.',
    whatItIs: 'The Global AI Olympiad (GAIO) is a premier international competition and research initiative dedicated to identifying and nurturing the world\'s top AI talent.',
    whyItsNeeded: 'To ensure AI development remains transparent, competitive, and focused on collective human advancement.',
    url: 'https://gaio.world',
    image: '/uploads/global-ai.webp',
    order: 1
  },
  {
    type: 'cooperative',
    title: 'Community Cooperative',
    description: 'Democratic digital platforms for local economic empowerment and resource sharing.',
    whatItIs: 'The BritSync Community Cooperative is a decentralized framework designed to empower local economies through shared digital resources.',
    whyItsNeeded: 'Local communities need digital infrastructure to compete with global platforms.',
    url: 'https://britsync.co.uk/coop',
    image: '/uploads/coop.webp',
    order: 2
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const data of initiativesData) {
      const existing = await Initiative.findOne({ title: data.title });
      if (!existing) {
        await new Initiative(data).save();
        console.log(`Successfully seeded: ${data.title}`);
      } else {
        console.log(`Skipped: ${data.title} (already exists in DB)`);
      }
    }

    const count = await Initiative.countDocuments();
    console.log(`Current Total Initiatives in DB: ${count}`);
    
    console.log('Seeding process completed!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
}

seed();
