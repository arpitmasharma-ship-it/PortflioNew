import { connectDb } from '../config/db.js';
import { assertEnv } from '../config/env.js';
import { Profile } from '../models/Profile.js';
import { Skill } from '../models/Skill.js';
import { Project } from '../models/Project.js';
import { Education } from '../models/Education.js';
import { SocialLink } from '../models/SocialLink.js';

assertEnv();
await connectDb();

const profileExists = await Profile.findOne();
if (!profileExists) {
  await Profile.create({
    fullName: 'Arpit',
    professionalTitle: 'Software Engineer',
    location: 'India',
    email: 'hello@example.com',
    headline: 'Building useful things for the web.',
    shortIntro:
      'I am a software engineer who enjoys turning messy problems into clear, maintainable products. I care about thoughtful interfaces, reliable backends, and the craft of shipping work I would be proud to maintain.',
    about:
      'I came to software because I like making things that other people can actually use. Most of my time is spent learning by building: reading code, writing it, breaking it, and putting it back together with a little more care than before.\n\nI am still early in my career and I treat that honestly. I would rather show real projects, real questions, and real growth than a list of inflated claims. What I can offer is curiosity, careful work, and the willingness to go deep on a problem until it makes sense.',
    interests:
      'I am drawn to full-stack web development, data structures, and the quieter parts of engineering: naming things well, designing APIs that stay kind to future me, and making interfaces that feel calm rather than loud.',
    approach:
      'I learn fastest when I have a concrete thing to ship. I start small, get a working slice in place, then refine. I read documentation, write notes, and revisit old projects when I notice I would do them differently now. That loop—build, notice, improve—is the core of how I work.',
    careerGoals:
      'I am looking for internships and early-career roles where I can contribute to real products, learn from experienced engineers, and keep growing as a full-stack developer.',
    availability: {
      isAvailable: true,
      label: 'Open to internships and collaborations',
    },
    seo: {
      siteTitle: 'Arpit — Software Engineer',
      description:
        'Personal portfolio of Arpit, a software engineer building useful things for the web.',
    },
  });
}

if ((await Skill.countDocuments()) === 0) {
  const skills = [
    ['C++', 'languages', 'Braces'],
    ['JavaScript', 'languages', 'FileCode'],
    ['HTML', 'frontend', 'Code'],
    ['CSS', 'frontend', 'Palette'],
    ['React', 'frontend', 'Atom'],
    ['Tailwind CSS', 'frontend', 'Wind'],
    ['Node.js', 'backend', 'Server'],
    ['Express.js', 'backend', 'Network'],
    ['REST APIs', 'backend', 'Waypoints'],
    ['MongoDB', 'database', 'Database'],
    ['SQL', 'database', 'Table'],
    ['DSA', 'fundamentals', 'Binary'],
    ['OOP', 'fundamentals', 'Boxes'],
    ['DBMS', 'fundamentals', 'Layers'],
    ['Operating Systems', 'fundamentals', 'Cpu'],
    ['Computer Networks', 'fundamentals', 'Share2'],
    ['Git', 'tools', 'GitBranch'],
    ['GitHub', 'tools', 'Github'],
    ['VS Code', 'tools', 'SquareTerminal'],
    ['Postman', 'tools', 'Send'],
  ];
  await Skill.insertMany(
    skills.map(([name, category, icon], order) => ({ name, category, icon, order })),
  );
}

if ((await Project.countDocuments()) === 0) {
  await Project.create({
    title: 'This Portfolio',
    slug: 'personal-portfolio',
    shortDescription:
      'A MERN portfolio with a calm editorial design and a private admin workspace for content.',
    overview:
      'This site is both a public portfolio and a small content system. The public pages are designed to be quiet and readable. The admin area lets me update projects, skills, education, and messages without changing source code for every new item.',
    category: 'Full-stack',
    tags: ['MERN', 'React', 'Express'],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    features: [
      'Public pages driven by a single profile document',
      'Protected admin CRUD for portfolio content',
      'Contact form with validation, rate limiting, and stored messages',
    ],
    role: 'Sole designer and engineer',
    contribution: 'Product design, frontend architecture, API, and content model.',
    challenges:
      'Keeping the visual language consistent across many page types without turning the site into a dashboard, and making content editable without sacrificing design quality.',
    solutions:
      'A shared design system on the frontend and a single profile source of truth on the backend, with admin tools that edit structured data rather than raw HTML.',
    status: 'in-progress',
    featured: true,
    order: 0,
  });
}

if ((await Education.countDocuments()) === 0) {
  await Education.create({
    institution: 'Your College or University',
    degree: 'Bachelor of Technology',
    branch: 'Computer Science',
    startYear: '2023',
    endYear: '2027',
    current: true,
    showGrades: false,
    coursework: ['Data Structures', 'Database Systems', 'Operating Systems', 'Computer Networks'],
    visible: true,
  });
}

if ((await SocialLink.countDocuments()) === 0) {
  await SocialLink.insertMany([
    {
      platform: 'github',
      label: 'GitHub',
      url: 'https://github.com/your-handle',
      icon: 'Github',
      order: 0,
      visible: false,
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/your-handle',
      icon: 'Linkedin',
      order: 1,
      visible: false,
    },
  ]);
}

console.log('Seed complete. Social links are hidden until you add real URLs in admin.');
process.exit(0);
