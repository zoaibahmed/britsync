const mongoose = require('mongoose');

const DocuUserSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    email_verified: { type: Boolean, default: false },
    avatar_url: { type: String, default: '' }
}, {
    timestamps: true,
    collection: 'docu_users'
});

module.exports = mongoose.model('DocuUser', DocuUserSchema);
