import { Router } from 'express';
import { Skill } from '../models/Skill.js';
import { Project } from '../models/Project.js';
import { Experience } from '../models/Experience.js';
import { Education } from '../models/Education.js';
import { Achievement } from '../models/Achievement.js';
import { SocialLink } from '../models/SocialLink.js';
import { BlogPost } from '../models/BlogPost.js';
import { createCrudController } from '../controllers/crudController.js';
import { getStats, updateProfile } from '../controllers/profileController.js';
import { deleteMessage, listMessages, markRead } from '../controllers/contactController.js';
import {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getUploadStatus,
} from '../controllers/uploadController.js';
import { uploadSingle, uploadMultiple } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import {
  achievementSchema,
  blogSchema,
  educationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  reorderSchema,
  skillSchema,
  socialSchema,
} from '../validators/content.js';

const skills = createCrudController(Skill);
const projects = createCrudController(Project, { slugFrom: 'title' });
const experience = createCrudController(Experience);
const education = createCrudController(Education);
const achievements = createCrudController(Achievement);
const social = createCrudController(SocialLink);
const posts = createCrudController(BlogPost, { slugFrom: 'title' });

function resource(router, path, ctrl, schema) {
  router.get(path, ctrl.listAdmin);
  router.post(path, validate(schema), ctrl.create);
  router.patch(`${path}/reorder`, validate(reorderSchema), ctrl.reorder);
  router.patch(`${path}/:id`, validate(schema.partial()), ctrl.update);
  router.delete(`${path}/:id`, ctrl.remove);
}

export const adminRouter = Router();

adminRouter.get('/stats', getStats);
adminRouter.patch('/profile', validate(profileSchema.partial()), updateProfile);

adminRouter.get('/upload/status', getUploadStatus);
adminRouter.post('/upload', uploadSingle, uploadFile);
adminRouter.post('/upload/multiple', uploadMultiple, uploadMultipleFiles);
adminRouter.post('/upload/delete', deleteFile);

resource(adminRouter, '/skills', skills, skillSchema);
resource(adminRouter, '/projects', projects, projectSchema);
resource(adminRouter, '/experience', experience, experienceSchema);
resource(adminRouter, '/education', education, educationSchema);
resource(adminRouter, '/achievements', achievements, achievementSchema);
resource(adminRouter, '/social', social, socialSchema);
resource(adminRouter, '/blog', posts, blogSchema);

adminRouter.get('/messages', listMessages);
adminRouter.patch('/messages/:id/read', markRead);
adminRouter.delete('/messages/:id', deleteMessage);
