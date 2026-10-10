import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    inquiryType: {
      type: String,
      enum: ['general', 'internship', 'collaboration', 'other'],
      default: 'general',
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ read: 1 });

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
