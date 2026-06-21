const mongoose = require('mongoose');

const DocuNotificationSchema = new mongoose.Schema({
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser', required: true },
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuDocumentNew' },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read_at: { type: Date, default: null }
}, {
    timestamps: true,
    collection: 'docu_notifications'
});

module.exports = mongoose.model('DocuNotification', DocuNotificationSchema);
