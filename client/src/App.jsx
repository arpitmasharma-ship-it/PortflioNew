import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from './layouts/SiteLayout.jsx';
import { AdminLayout } from './layouts/AdminLayout.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import {
  AdminAchievements,
  AdminEducation,
  AdminExperience,
  AdminJournal,
  AdminProjects,
  AdminSkills,
  AdminSocial,
} from './pages/admin/resources.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Skills = lazy(() => import('./pages/Skills.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Experience = lazy(() => import('./pages/Experience.jsx'));
const Education = lazy(() => import('./pages/Education.jsx'));
const Achievements = lazy(() => import('./pages/Achievements.jsx'));
const Resume = lazy(() => import('./pages/Resume.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Connect = lazy(() => import('./pages/Connect.jsx'));
const Journal = lazy(() => import('./pages/Journal.jsx'));
const JournalPost = lazy(() => import('./pages/JournalPost.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const Login = lazy(() => import('./pages/admin/Login.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile.jsx'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages.jsx'));

function Fallback() {
  return <div className="p-10 text-sm text-muted">Loading…</div>;
}

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<JournalPost />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="achievements" element={<AdminAchievements />} />
          <Route path="social" element={<AdminSocial />} />
          <Route path="journal" element={<AdminJournal />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
