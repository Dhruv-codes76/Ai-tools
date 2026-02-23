const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  sourceLink: { type: String },
  tags: [{ type: String }],
  seoMetaTitle: { type: String },
  seoMetaDescription: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
