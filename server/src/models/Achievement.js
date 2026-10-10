import mongoose from 'mongoose';

export const ACHIEVEMENT_TYPES = [
  'certification',
  'coding',
  'hackathon',
  'award',
  'academic',
  'workshop',
  'cp-profile',
];

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ACHIEVEMENT_TYPES },
    issuer: { type: String, trim: true, default: '' },
    date: { type: Date },
    image: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

achievementSchema.index({ type: 1, order: 1 });

export const Achievement = mongoose.model('Achievement', achievementSchema);
