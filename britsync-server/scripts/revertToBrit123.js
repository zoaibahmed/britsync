// Script to reset admin password to 'britsync123' in SiteSetting collection
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/britsync';

const SiteSetting = require('../models/SiteSetting');

async function resetAdminPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    const hash = await bcrypt.hash('britsync123', 10);
    await SiteSetting.findOneAndUpdate(
      { key: 'admin_password' },
      { value: hash },
      { upsert: true, new: true }
    );
    console.log('Admin password reset to britsync123');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting admin password:', err);
    process.exit(1);
  }
}

resetAdminPassword();
