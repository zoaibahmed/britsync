const mongoose = require('mongoose');

const DocuAdminAuditLogSchema = new mongoose.Schema({
    actor_admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser', required: true, index: true },
    actor_role: { type: String, required: true },
    action: { type: String, required: true, index: true },
    target_type: { type: String, required: true, index: true },
    target_id: { type: String, index: true },
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace', index: true },
    reason: { type: String },
    ip_address: { type: String },
    user_agent: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
    timestamps: true,
    collection: 'docu_admin_audit_logs'
});

module.exports = mongoose.model('DocuAdminAuditLog', DocuAdminAuditLogSchema);
