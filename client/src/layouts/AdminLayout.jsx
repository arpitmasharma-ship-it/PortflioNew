import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/profile', label: 'Profile' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/experience', label: 'Experience' },
  { to: '/admin/education', label: 'Education' },
  { to: '/admin/achievements', label: 'Achievements' },
  { to: '/admin/social', label: 'Social links' },
  { to: '/admin/journal', label: 'Journal' },
  { to: '/admin/messages', label: 'Messages' },
];

export function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-cream/70 p-5 lg:border-b-0 lg:border-r">
        <p className="font-display text-xl">Studio</p>
        <p className="mt-1 text-xs text-muted">{user?.email}</p>
        <nav className="mt-6 flex flex-wrap gap-2 lg:flex-col">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-ink text-paper' : 'text-ink hover:bg-paper'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={onLogout}
          className="mt-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
        >
          <LogOut size={14} /> Sign out
        </button>
      </aside>
      <div className="p-5 sm:p-8">
        <Outlet />
      </div>
    </div>
  );
}
