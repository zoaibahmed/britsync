const mongoose = require('mongoose');

const DocuTemplateSchema = new mongoose.Schema({
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace', required: true },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser', required: true },
    template_name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    file_url: { type: String, required: true },
    fields_json: { type: String, default: '[]' }, // JSON string array of pre-configured fields
    recipients_json: { type: String, default: '[]' }, // JSON string array of template roles (e.g. Signer 1, Signer 2)
    default_message: { type: String, default: '' }
}, {
    timestamps: true,
    collection: 'docu_templates'
});

module.exports = mongoose.model('DocuTemplate', DocuTemplateSchema);
