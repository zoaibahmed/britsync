const mongoose = require('mongoose');

const DocuAdminNoteSchema = new mongoose.Schema({
    target_type: { type: String, required: true, index: true },
    target_id: { type: String, required: true, index: true },
    note: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser', required: true }
}, {
    timestamps: true,
    collection: 'docu_admin_notes'
});

module.exports = mongoose.model('DocuAdminNote', DocuAdminNoteSchema);
