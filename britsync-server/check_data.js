const mongoose = require('mongoose');
require('dotenv').config();
const Initiative = require('./models/Initiative');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await Initiative.countDocuments();
    const all = await Initiative.find();
    console.log('INITIATIVE_COUNT:', count);
    console.log('INITIATIVES_DATA:', JSON.stringify(all, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
