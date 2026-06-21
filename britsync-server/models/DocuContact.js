const mongoose = require('mongoose');

const DocuContactSchema = new mongoose.Schema({
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    address: { type: String, default: '' },
    notes: { type: String, default: '' },
    tags_json: { type: String, default: '[]' }
}, {
    timestamps: true,
    collection: 'docu_contacts'
});

module.exports = mongoose.model('DocuContact', DocuContactSchema);
