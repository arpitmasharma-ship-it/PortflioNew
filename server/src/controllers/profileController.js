import { Profile } from '../models/Profile.js';
import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { Experience } from '../models/Experience.js';
import { Education } from '../models/Education.js';
import { Achievement } from '../models/Achievement.js';
import { BlogPost } from '../models/BlogPost.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne().lean();
  sendSuccess(res, { data: profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
  sendSuccess(res, { message: 'Profile updated', data: profile });
});

export const getStats = asyncHandler(async (req, res) => {
  const [projects, skills, experience, education, achievements, posts, unread] = await Promise.all([
    Project.countDocuments(),
    Skill.countDocuments(),
    Experience.countDocuments(),
    Education.countDocuments(),
    Achievement.countDocuments(),
    BlogPost.countDocuments(),
    ContactMessage.countDocuments({ read: false }),
  ]);
  sendSuccess(res, {
    data: { projects, skills, experience, education, achievements, posts, unreadMessages: unread },
  });
});
