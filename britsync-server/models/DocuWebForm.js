const mongoose = require('mongoose');

const DocuWebFormSchema = new mongoose.Schema({
    workspace_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuWorkspace', required: true, index: true },
    template_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DocuTemplate', required: true },
    form_title: { type: String, required: true },
    description: { type: String, default: '' },
    slug: { type: String, required: true, unique: true, index: true },
    is_active: { type: Boolean, default: true },
    expiry_date: { type: Date },
    submission_limit: { type: Number, default: 0 }, // 0 means unlimited
    submission_count: { type: Number, default: 0 }
}, {
    timestamps: true,
    collection: 'docu_web_forms'
});

module.exports = mongoose.model('DocuWebForm', DocuWebFormSchema);
