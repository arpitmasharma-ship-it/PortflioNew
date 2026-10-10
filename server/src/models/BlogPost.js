import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    category: { type: String, default: 'Notes' },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
    coverImage: { type: String, default: '' },
    readingTime: { type: Number, default: 1 },
  },
  { timestamps: true },
);

blogPostSchema.index({ published: 1, publishedAt: -1 });

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
