const mongoose = require('mongoose');

const DocuReminderSchema = new mongoose.Schema({
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuDocumentNew', required: true },
    recipient_id: { type: String, required: true },
    reminder_type: { type: String, enum: ['none', 'daily', 'every_2_days', 'every_3_days', 'weekly', 'custom'], default: 'none' },
    next_send_at: { type: Date },
    last_sent_at: { type: Date },
    status: { type: String, enum: ['active', 'paused', 'stopped'], default: 'active' }
}, {
    timestamps: true,
    collection: 'docu_reminders'
});

module.exports = mongoose.model('DocuReminder', DocuReminderSchema);
