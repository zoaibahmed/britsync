const mongoose = require('mongoose');

const DocuJoinRequestSchema = new mongoose.Schema({
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser', required: true },
    requester_name: { type: String, required: true },
    requester_email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, default: '' },
    requested_role: { type: String, enum: ['admin', 'manager', 'sender', 'viewer'], default: 'sender' },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'withdrawn'], default: 'pending' },
    reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser' },
    reviewed_at: { type: Date },
    rejection_reason: { type: String, default: '' }
}, {
    timestamps: true,
    collection: 'docu_join_requests'
});

// Compound index for fast queries by workspace/user/status
DocuJoinRequestSchema.index({ workspace_id: 1, user_id: 1, status: 1 });

module.exports = mongoose.model('DocuJoinRequest', DocuJoinRequestSchema);
