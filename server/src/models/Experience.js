import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    title: { type: String, required: true, trim: true },
    employmentType: {
      type: String,
      enum: ['internship', 'full-time', 'part-time', 'contract', 'freelance', 'other'],
      default: 'internship',
    },
    startDate: { type: Date },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    location: { type: String, default: '' },
    remote: { type: Boolean, default: false },
    responsibilities: [{ type: String }],
    technologies: [{ type: String }],
    achievements: [{ type: String }],
    certificateUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

experienceSchema.index({ order: 1, startDate: -1 });

export const Experience = mongoose.model('Experience', experienceSchema);
