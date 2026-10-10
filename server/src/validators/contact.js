import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  subject: z.string().trim().min(3).max(140),
  message: z.string().trim().min(20).max(4000),
  inquiryType: z.enum(['general', 'internship', 'collaboration', 'other']).optional(),
});
