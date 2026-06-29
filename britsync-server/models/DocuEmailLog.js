const mongoose = require('mongoose');

const DocuEmailLogSchema = new mongoose.Schema({
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace', index: true },
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuDocumentNew', index: true },
    recipient_email: { type: String, required: true, index: true },
    email_type: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ['SENT', 'FAILED'], default: 'SENT', index: true },
    provider_message_id: { type: String },
    error_message: { type: String },
    sent_at: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'docu_email_logs'
});

module.exports = mongoose.model('DocuEmailLog', DocuEmailLogSchema);
