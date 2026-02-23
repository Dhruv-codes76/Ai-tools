const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    website: { type: String, required: true },
    pricing: { type: String, enum: ['free', 'freemium', 'paid'], required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: String }],
    affiliateLink: { type: String },
    verified: { type: Boolean, default: false },
    seoMetaTitle: { type: String },
    seoMetaDescription: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('Tool', toolSchema);
