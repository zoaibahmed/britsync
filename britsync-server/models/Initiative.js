const mongoose = require('mongoose');

const InitiativeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['global', 'cooperative'], required: true },
    image: { type: String },
    url: { type: String },
    description: { type: String }, // Short desc for card
    whatItIs: { type: String },    // Detailed info for popup
    whyItsNeeded: { type: String }, // Detailed info for popup
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Initiative', InitiativeSchema);
