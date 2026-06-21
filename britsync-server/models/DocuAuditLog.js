const mongoose = require('mongoose');

const DocuAuditLogSchema = new mongoose.Schema({
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuDocument', required: true },
    recipient_email: { type: String, default: '' },
    event_type: { type: String, required: true },
    ip_address: { type: String, default: '' },
    user_agent: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('DocuAuditLog', DocuAuditLogSchema);
