const mongoose = require('mongoose');

const DocuSupportTicketSchema = new mongoose.Schema({
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace', index: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser', required: true, index: true },
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuDocumentNew', index: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['OPEN', 'PENDING', 'RESOLVED', 'CLOSED'], default: 'OPEN', index: true },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM', index: true },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser', index: true },
    internal_notes: { type: String }
}, {
    timestamps: true,
    collection: 'docu_support_tickets'
});

module.exports = mongoose.model('DocuSupportTicket', DocuSupportTicketSchema);
