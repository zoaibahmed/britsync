const mongoose = require('mongoose');

const DocuSubscriptionSchema = new mongoose.Schema({
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace', required: true, index: true },
    stripe_customer_id: { type: String, required: true },
    stripe_subscription_id: { type: String, required: true },
    plan: { type: String, enum: ['free', 'pro', 'business', 'enterprise'], default: 'free' },
    status: { type: String, required: true }, // active, canceled, etc.
    price_id: { type: String, default: '' },
    current_period_start: { type: Date, required: true },
    current_period_end: { type: Date, required: true },
    cancel_at_period_end: { type: Boolean, default: false },
    trial_ends_at: { type: Date }
}, {
    timestamps: true,
    collection: 'docu_subscriptions'
});

module.exports = mongoose.model('DocuSubscription', DocuSubscriptionSchema);
