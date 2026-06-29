const mongoose = require('mongoose');

const DocuPlanConfigSchema = new mongoose.Schema({
    plan_key: { type: String, required: true, unique: true, index: true },
    display_name: { type: String, required: true },
    description: { type: String },
    monthly_price_display: { type: Number, required: true },
    yearly_price_display: { type: Number, required: true },
    stripe_monthly_price_id: { type: String },
    stripe_yearly_price_id: { type: String },
    limits: {
        documents_per_month: { type: Number, required: true },
        team_members: { type: Number, required: true },
        templates: { type: Number, required: true },
        storage_mb: { type: Number, required: true },
        bulk_sends: { type: Number, required: true }
    },
    features: {
        contacts: { type: Boolean, default: false },
        reminders: { type: Boolean, default: false },
        custom_branding: { type: Boolean, default: false },
        audit_certificate: { type: Boolean, default: false },
        sequential_signing: { type: Boolean, default: false },
        bulk_send: { type: Boolean, default: false },
        signer_otp: { type: Boolean, default: false },
        public_forms: { type: Boolean, default: false },
        webhooks: { type: Boolean, default: false },
        reports: { type: Boolean, default: false },
        api_access: { type: Boolean, default: false }
    },
    is_active: { type: Boolean, default: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuUser' }
}, {
    timestamps: true,
    collection: 'docu_plan_configs'
});

module.exports = mongoose.model('DocuPlanConfig', DocuPlanConfigSchema);
