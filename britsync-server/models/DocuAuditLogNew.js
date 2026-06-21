const mongoose = require('mongoose');

const DocuAuditLogNewSchema = new mongoose.Schema({
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace' },
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuDocumentNew' },
    recipient_id: { type: String, default: '' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser' },
    event_type: { type: String, required: true },
    ip_address: { type: String, default: '' },
    user_agent: { type: String, default: '' },
    metadata_json: { type: String, default: '{}' }
}, {
    timestamps: true,
    collection: 'docu_audit_logs'
});

module.exports = mongoose.model('DocuAuditLogNew', DocuAuditLogNewSchema);
