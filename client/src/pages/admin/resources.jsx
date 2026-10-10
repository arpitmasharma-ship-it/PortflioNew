import { AdminResource } from './AdminResource.jsx';
import { skillCategoryLabels, achievementTypeLabels } from '../../constants/nav.js';

export function AdminSkills() {
  return (
    <AdminResource
      title="Skills"
      path="/skills"
      defaults={{ name: '', category: 'languages', icon: 'Code2', order: 0, visible: true }}
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category', type: 'select', options: Object.keys(skillCategoryLabels) },
        { key: 'icon', label: 'Lucide icon name' },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'visible', label: 'Visible', type: 'checkbox' },
      ]}
    />
  );
}

export function AdminProjects() {
  return (
    <AdminResource
      title="Projects"
      path="/projects"
      defaults={{
        title: '',
        shortDescription: '',
        overview: '',
        thumbnail: '',
        technologies: '',
        category: 'Web',
        tags: '',
        features: '',
        role: '',
        contribution: '',
        challenges: '',
        solutions: '',
        githubUrl: '',
        liveUrl: '',
        status: 'completed',
        featured: false,
        visible: true,
        order: 0,
      }}
      fields={[
        { key: 'title', label: 'Title' },
        { key: 'shortDescription', label: 'Short description', type: 'textarea', rows: 3 },
        { key: 'overview', label: 'Overview', type: 'textarea', rows: 6 },
        { key: 'thumbnail', label: 'Thumbnail', type: 'upload' },
        { key: 'category', label: 'Category' },
        { key: 'technologies', label: 'Technologies', type: 'list' },
        { key: 'tags', label: 'Tags', type: 'list' },
        { key: 'features', label: 'Features', type: 'list' },
        { key: 'role', label: 'Role' },
        { key: 'contribution', label: 'Contribution', type: 'textarea' },
        { key: 'challenges', label: 'Challenges', type: 'textarea' },
        { key: 'solutions', label: 'Solutions', type: 'textarea' },
        { key: 'githubUrl', label: 'GitHub URL' },
        { key: 'liveUrl', label: 'Live URL' },
        { key: 'status', label: 'Status', type: 'select', options: ['completed', 'in-progress', 'archived'] },
        { key: 'featured', label: 'Featured', type: 'checkbox' },
        { key: 'visible', label: 'Visible', type: 'checkbox' },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
    />
  );
}

export function AdminExperience() {
  return (
    <AdminResource
      title="Experience"
      path="/experience"
      defaults={{
        company: '',
        title: '',
        employmentType: 'internship',
        startDate: '',
        endDate: '',
        location: '',
        remote: false,
        current: false,
        responsibilities: '',
        technologies: '',
        achievements: '',
        certificateUrl: '',
        logo: '',
        visible: true,
        order: 0,
      }}
      fields={[
        { key: 'company', label: 'Company' },
        { key: 'title', label: 'Title' },
        { key: 'employmentType', label: 'Type', type: 'select', options: ['internship', 'full-time', 'part-time', 'contract', 'freelance', 'other'] },
        { key: 'location', label: 'Location' },
        { key: 'logo', label: 'Logo', type: 'upload' },
        { key: 'startDate', label: 'Start date (YYYY-MM-DD)' },
        { key: 'endDate', label: 'End date' },
        { key: 'current', label: 'Current role', type: 'checkbox' },
        { key: 'remote', label: 'Remote', type: 'checkbox' },
        { key: 'responsibilities', label: 'Responsibilities', type: 'list' },
        { key: 'technologies', label: 'Technologies', type: 'list' },
        { key: 'achievements', label: 'Achievements', type: 'list' },
        { key: 'certificateUrl', label: 'Certificate URL' },
        { key: 'visible', label: 'Visible', type: 'checkbox' },
      ]}
    />
  );
}

export function AdminEducation() {
  return (
    <AdminResource
      title="Education"
      path="/education"
      defaults={{
        institution: '',
        degree: '',
        branch: '',
        startYear: '',
        endYear: '',
        current: true,
        cgpa: '',
        sgpa: '',
        showGrades: false,
        coursework: '',
        projects: '',
        activities: '',
        visible: true,
      }}
      fields={[
        { key: 'institution', label: 'Institution' },
        { key: 'degree', label: 'Degree' },
        { key: 'branch', label: 'Branch' },
        { key: 'startYear', label: 'Start year' },
        { key: 'endYear', label: 'End / expected year' },
        { key: 'current', label: 'Currently studying', type: 'checkbox' },
        { key: 'showGrades', label: 'Show grades publicly', type: 'checkbox' },
        { key: 'cgpa', label: 'CGPA' },
        { key: 'sgpa', label: 'SGPA' },
        { key: 'coursework', label: 'Coursework', type: 'list' },
        { key: 'projects', label: 'Academic projects', type: 'list' },
        { key: 'activities', label: 'Activities', type: 'list' },
        { key: 'visible', label: 'Visible', type: 'checkbox' },
      ]}
    />
  );
}

export function AdminAchievements() {
  return (
    <AdminResource
      title="Achievements"
      path="/achievements"
      defaults={{
        title: '',
        type: 'certification',
        issuer: '',
        date: '',
        image: '',
        credentialUrl: '',
        description: '',
        visible: true,
      }}
      fields={[
        { key: 'title', label: 'Title' },
        { key: 'type', label: 'Type', type: 'select', options: Object.keys(achievementTypeLabels) },
        { key: 'issuer', label: 'Issuer' },
        { key: 'date', label: 'Date (YYYY-MM-DD)' },
        { key: 'image', label: 'Image', type: 'upload' },
        { key: 'credentialUrl', label: 'Credential URL' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'visible', label: 'Visible', type: 'checkbox' },
      ]}
    />
  );
}

export function AdminSocial() {
  return (
    <AdminResource
      title="Social links"
      path="/social"
      defaults={{ platform: 'github', label: 'GitHub', url: '', icon: 'Github', visible: true, order: 0 }}
      fields={[
        { key: 'platform', label: 'Platform' },
        { key: 'label', label: 'Label' },
        { key: 'url', label: 'URL' },
        { key: 'icon', label: 'Lucide icon name' },
        { key: 'visible', label: 'Visible publicly', type: 'checkbox' },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
    />
  );
}

export function AdminJournal() {
  return (
    <AdminResource
      title="Journal"
      path="/blog"
      defaults={{
        title: '',
        excerpt: '',
        content: '',
        category: 'Notes',
        tags: '',
        published: false,
        coverImage: '',
      }}
      fields={[
        { key: 'title', label: 'Title' },
        { key: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 3 },
        { key: 'content', label: 'Content', type: 'textarea', rows: 10 },
        { key: 'category', label: 'Category' },
        { key: 'tags', label: 'Tags', type: 'list' },
        { key: 'coverImage', label: 'Cover', type: 'upload' },
        { key: 'published', label: 'Published', type: 'checkbox' },
      ]}
    />
  );
}
