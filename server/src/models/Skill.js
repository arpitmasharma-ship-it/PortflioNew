import mongoose from 'mongoose';

export const SKILL_CATEGORIES = [
  'languages',
  'frontend',
  'backend',
  'database',
  'fundamentals',
  'tools',
  'other',
];

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: SKILL_CATEGORIES },
    icon: { type: String, trim: true, default: 'Code2' },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

skillSchema.index({ category: 1, order: 1 });

export const Skill = mongoose.model('Skill', skillSchema);
