const mongoose = require('mongoose');

const DocuInviteSchema = new mongoose.Schema({
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace', required: true },
    invite_code: { type: String, required: true, unique: true, index: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser', required: true },
    default_role: { type: String, enum: ['admin', 'manager', 'sender', 'viewer'], default: 'sender' },
    require_approval: { type: Boolean, default: false },
    max_uses: { type: Number, default: 0 }, // 0 means unlimited
    used_count: { type: Number, default: 0 },
    expires_at: { type: Date },
    status: { type: String, enum: ['active', 'disabled', 'expired'], default: 'active' }
}, {
    timestamps: true,
    collection: 'docu_invites'
});

module.exports = mongoose.model('DocuInvite', DocuInviteSchema);
