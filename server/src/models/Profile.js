import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    professionalTitle: { type: String, required: true, trim: true },
    location: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    headline: { type: String, trim: true, default: 'Building useful things for the web.' },
    shortIntro: { type: String, default: '' },
    about: { type: String, default: '' },
    interests: { type: String, default: '' },
    approach: { type: String, default: '' },
    careerGoals: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    availability: {
      isAvailable: { type: Boolean, default: true },
      label: { type: String, default: 'Open to internships and collaborations' },
    },
    seo: {
      siteTitle: { type: String, default: '' },
      description: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
  },
  { timestamps: true },
);

export const Profile = mongoose.model('Profile', profileSchema);
