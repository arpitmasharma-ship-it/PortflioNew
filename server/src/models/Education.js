import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, trim: true, default: '' },
    branch: { type: String, trim: true, default: '' },
    startYear: { type: String, default: '' },
    endYear: { type: String, default: '' },
    current: { type: Boolean, default: false },
    achievements: [{ type: String }],
    cgpa: { type: String, default: '' },
    sgpa: { type: String, default: '' },
    showGrades: { type: Boolean, default: false },
    coursework: [{ type: String }],
    projects: [{ type: String }],
    activities: [{ type: String }],
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Education = mongoose.model('Education', educationSchema);
