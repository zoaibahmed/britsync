const mongoose = require('mongoose');

const DocuWorkspaceMemberSchema = new mongoose.Schema({
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser', required: true },
    role: { type: String, enum: ['owner', 'admin', 'member', 'viewer'], default: 'member' },
    status: { type: String, enum: ['invited', 'joined'], default: 'invited' },
    invited_by: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser' }
}, {
    timestamps: true,
    collection: 'docu_workspace_members'
});

module.exports = mongoose.model('DocuWorkspaceMember', DocuWorkspaceMemberSchema);
