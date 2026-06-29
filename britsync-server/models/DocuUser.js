const mongoose = require('mongoose');

const DocuUserSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password_hash: { type: String, required: true },
    email_verified: { type: Boolean, default: false },
    avatar_url: { type: String, default: '' },
    onboarding_completed: { type: Boolean, default: false },
    personal_workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace' },
    default_workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace' },
    platform_role: { 
        type: String, 
        enum: ['USER', 'SUPER_ADMIN', 'SUPPORT_ADMIN', 'BILLING_ADMIN', 'READ_ONLY_ADMIN'], 
        default: 'USER',
        index: true 
    },
    status: { 
        type: String, 
        enum: ['ACTIVE', 'SUSPENDED', 'DELETED'], 
        default: 'ACTIVE',
        index: true 
    },
    last_login_at: { type: Date },
    last_login_ip: { type: String },
    failed_login_count: { type: Number, default: 0 }
}, {
    timestamps: true,
    collection: 'docu_users'
});

module.exports = mongoose.model('DocuUser', DocuUserSchema);
