import { z } from 'zod';
import { SKILL_CATEGORIES } from '../models/Skill.js';
import { ACHIEVEMENT_TYPES } from '../models/Achievement.js';

const optionalUrl = z.union([z.literal(''), z.string().url()]).optional();

export const profileSchema = z.object({
  fullName: z.string().min(1).max(80),
  professionalTitle: z.string().min(1).max(120),
  location: z.string().max(120).optional(),
  email: z.union([z.literal(''), z.string().email()]).optional(),
  headline: z.string().max(180).optional(),
  shortIntro: z.string().max(800).optional(),
  about: z.string().max(8000).optional(),
  interests: z.string().max(4000).optional(),
  approach: z.string().max(4000).optional(),
  careerGoals: z.string().max(4000).optional(),
  profileImage: z.string().optional(),
  resumeUrl: optionalUrl,
  availability: z
    .object({
      isAvailable: z.boolean().optional(),
      label: z.string().max(160).optional(),
    })
    .optional(),
  seo: z
    .object({
      siteTitle: z.string().max(80).optional(),
      description: z.string().max(300).optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1).max(60),
  category: z.enum(SKILL_CATEGORIES),
  icon: z.string().max(40).optional(),
  order: z.number().int().optional(),
  visible: z.boolean().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1).max(120),
  slug: z.string().max(140).optional(),
  shortDescription: z.string().min(1).max(280),
  overview: z.string().max(8000).optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  category: z.string().max(60).optional(),
  tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  role: z.string().max(200).optional(),
  contribution: z.string().max(4000).optional(),
  challenges: z.string().max(4000).optional(),
  solutions: z.string().max(4000).optional(),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  status: z.enum(['completed', 'in-progress', 'archived']).optional(),
  featured: z.boolean().optional(),
  createdDate: z.string().optional(),
  order: z.number().int().optional(),
  visible: z.boolean().optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1).max(120),
  logo: z.string().optional(),
  title: z.string().min(1).max(120),
  employmentType: z
    .enum(['internship', 'full-time', 'part-time', 'contract', 'freelance', 'other'])
    .optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  current: z.boolean().optional(),
  location: z.string().max(120).optional(),
  remote: z.boolean().optional(),
  responsibilities: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  certificateUrl: optionalUrl,
  order: z.number().int().optional(),
  visible: z.boolean().optional(),
});

export const educationSchema = z.object({
  institution: z.string().min(1).max(160),
  degree: z.string().max(120).optional(),
  branch: z.string().max(120).optional(),
  startYear: z.string().max(10).optional(),
  endYear: z.string().max(20).optional(),
  current: z.boolean().optional(),
  achievements: z.array(z.string()).optional(),
  cgpa: z.string().max(20).optional(),
  sgpa: z.string().max(20).optional(),
  showGrades: z.boolean().optional(),
  coursework: z.array(z.string()).optional(),
  projects: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  order: z.number().int().optional(),
  visible: z.boolean().optional(),
});

export const achievementSchema = z.object({
  title: z.string().min(1).max(160),
  type: z.enum(ACHIEVEMENT_TYPES),
  issuer: z.string().max(120).optional(),
  date: z.string().optional().nullable(),
  image: z.string().optional(),
  credentialUrl: optionalUrl,
  description: z.string().max(2000).optional(),
  order: z.number().int().optional(),
  visible: z.boolean().optional(),
});

export const socialSchema = z.object({
  platform: z.string().min(1).max(40),
  label: z.string().min(1).max(60),
  url: z.string().url(),
  icon: z.string().max(40).optional(),
  order: z.number().int().optional(),
  visible: z.boolean().optional(),
});

export const blogSchema = z.object({
  title: z.string().min(1).max(160),
  slug: z.string().max(180).optional(),
  excerpt: z.string().max(400).optional(),
  content: z.string().max(40000).optional(),
  category: z.string().max(60).optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  coverImage: z.string().optional(),
});

export const reorderSchema = z.object({
  ids: z.array(z.string()).min(1),
});
