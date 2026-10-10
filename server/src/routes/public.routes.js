import { Router } from 'express';
import { Skill } from '../models/Skill.js';
import { Project } from '../models/Project.js';
import { Experience } from '../models/Experience.js';
import { Education } from '../models/Education.js';
import { Achievement } from '../models/Achievement.js';
import { SocialLink } from '../models/SocialLink.js';
import { createCrudController } from '../controllers/crudController.js';
import { getProfile } from '../controllers/profileController.js';
import { createMessage } from '../controllers/contactController.js';
import { listPublished, getPublished } from '../controllers/blogPublicController.js';
import { contactLimiter } from '../middleware/rateLimits.js';
import { validate } from '../middleware/validate.js';
import { contactSchema } from '../validators/contact.js';

const skills = createCrudController(Skill);
const projects = createCrudController(Project);
const experience = createCrudController(Experience);
const education = createCrudController(Education);
const achievements = createCrudController(Achievement);
const social = createCrudController(SocialLink);

export const publicRouter = Router();

publicRouter.get('/profile', getProfile);
publicRouter.get('/skills', skills.listPublic);
publicRouter.get('/projects', projects.listPublic);
publicRouter.get('/projects/:slug', projects.getBySlug);
publicRouter.get('/experience', experience.listPublic);
publicRouter.get('/education', education.listPublic);
publicRouter.get('/achievements', achievements.listPublic);
publicRouter.get('/social', social.listPublic);
publicRouter.get('/blog', listPublished);
publicRouter.get('/blog/:slug', getPublished);
publicRouter.post('/contact', contactLimiter, validate(contactSchema), createMessage);
