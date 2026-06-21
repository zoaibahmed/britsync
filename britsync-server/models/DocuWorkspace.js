const mongoose = require('mongoose');

const DocuWorkspaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo_url: { type: String, default: '' },
    brand_color: { type: String, default: '#3b82f6' },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser', required: true }
}, {
    timestamps: true,
    collection: 'docu_workspaces'
});

module.exports = mongoose.model('DocuWorkspace', DocuWorkspaceSchema);
