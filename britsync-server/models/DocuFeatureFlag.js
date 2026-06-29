const mongoose = require('mongoose');

const DocuFeatureFlagSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    enabled: { type: Boolean, default: false },
    rollout_percentage: { type: Number, default: 100 },
    workspace_overrides: [{
        workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace' },
        enabled: { type: Boolean, required: true }
    }]
}, {
    timestamps: true,
    collection: 'docu_feature_flags'
});

module.exports = mongoose.model('DocuFeatureFlag', DocuFeatureFlagSchema);
