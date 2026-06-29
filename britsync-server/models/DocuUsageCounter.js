const mongoose = require('mongoose');

const DocuUsageCounterSchema = new mongoose.Schema({
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace', required: true },
    period_start: { type: Date, required: true },
    period_end: { type: Date, required: true },
    documents_sent: { type: Number, default: 0 },
    documents_completed: { type: Number, default: 0 },
    templates_created: { type: Number, default: 0 },
    bulk_sends: { type: Number, default: 0 },
    storage_used_mb: { type: Number, default: 0 },
    signer_auth_count: { type: Number, default: 0 }
}, {
    timestamps: true,
    collection: 'docu_usage_counters'
});

// Compound index to quickly find/upsert usage counters per workspace and billing cycle
DocuUsageCounterSchema.index({ workspace_id: 1, period_start: 1 }, { unique: true });

module.exports = mongoose.model('DocuUsageCounter', DocuUsageCounterSchema);
