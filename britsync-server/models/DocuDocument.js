const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
    page_number: { type: Number, required: true },
    field_type: { type: String, enum: ['text', 'user_signature', 'admin_signature'], required: true },
    assigned_to: { type: String, enum: ['user', 'admin'], required: true },
    x_percent: { type: Number, required: true },
    y_percent: { type: Number, required: true },
    width_percent: { type: Number, required: true },
    height_percent: { type: Number, required: true },
    placeholder: { type: String, default: '' },
    label: { type: String, default: '' },
    required: { type: Boolean, default: false },
    value: { type: String, default: '' },
    signature_data: { type: String, default: '' } // Base64 signature image
}, { timestamps: true });

const DocuDocumentSchema = new mongoose.Schema({
    document_name: { type: String, required: true },
    original_file_url: { type: String, required: true },
    final_file_url: { type: String, default: '' },
    recipient_email: { type: String, default: '' },
    secure_token: { type: String, required: true, unique: true },
    status: { 
        type: String, 
        enum: ['draft', 'sent', 'viewed', 'completed', 'expired', 'archived'], 
        default: 'draft' 
    },
    created_by_admin_id: { type: String, default: 'admin' },
    expires_at: { type: Date, required: true },
    sent_at: { type: Date },
    viewed_at: { type: Date },
    completed_at: { type: Date },
    archived_at: { type: Date },
    fields: [FieldSchema]
}, { timestamps: true });

module.exports = mongoose.model('DocuDocument', DocuDocumentSchema);
