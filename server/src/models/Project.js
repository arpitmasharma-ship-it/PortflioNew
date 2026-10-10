import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    overview: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    images: [{ type: String }],
    technologies: [{ type: String, trim: true }],
    category: { type: String, trim: true, default: 'Web' },
    tags: [{ type: String, trim: true }],
    features: [{ type: String }],
    role: { type: String, default: '' },
    contribution: { type: String, default: '' },
    challenges: { type: String, default: '' },
    solutions: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'archived'],
      default: 'completed',
    },
    featured: { type: Boolean, default: false },
    createdDate: { type: Date },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

projectSchema.index({ title: 'text', shortDescription: 'text', tags: 'text' });
projectSchema.index({ featured: 1, order: 1 });

export const Project = mongoose.model('Project', projectSchema);
