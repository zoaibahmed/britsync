const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    projectDescription: { type: String, required: true },
    startDate: { type: String, required: true },
    duration: { 
        type: { type: String, enum: ['one-time', 'continuous'], required: true },
        value: { type: String } // e.g., "3 months", "6 months", etc.
    },
    deliverables: { type: String, required: true },
    
    // --- PROFESSIONAL UPGRADE FIELDS ---
    executiveSummary: { type: String },
    objectives: [{ type: String }],
    scopeModules: [{
        title: String,
        details: String, // Description of the module
        features: [String] // List of specific features
    }],
    executionModels: [{
        name: String,
        description: String,
        features: [String]
    }],
    timelinePhases: [{
        phase: String, // e.g., "Month 1"
        title: String,
        description: String
    }],
    
    // --- STATUS & SIGNATURE ---
    status: { 
        type: String, 
        enum: ['pending', 'sent', 'accepted', 'signed'], 
        default: 'pending' 
    },
    signature: { type: String }, // Base64 or image path
    isRead: { type: Boolean, default: false },
    sentAt: { type: Date },
    signedAt: { type: Date },
    pricingOptions: [{
        name: { type: String },
        price: { type: Number },
        description: { type: String }
    }],
    discount: {
        enabled: { type: Boolean, default: false },
        type: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
        value: { type: Number, default: 0 }
    },
    detailedProposalUrl: { type: String }, // Strategic asset for separate download
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Proposal', ProposalSchema);
