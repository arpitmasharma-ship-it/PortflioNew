import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Cloud, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

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
  const [cloudinaryStatus, setCloudinaryStatus] = useState(null);

  useEffect(() => {
    api
      .get('/admin/upload/status')
      .then((res) => setCloudinaryStatus(res.data?.data))
      .catch(() => setCloudinaryStatus({ configured: false, connected: false }));
  }, []);

  async function onLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="flex flex-col justify-between border-b border-line bg-cream/70 p-5 lg:border-b-0 lg:border-r">
        <div>
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
        </div>

        <div className="mt-8 border-t border-line/60 pt-4 space-y-3">
          {/* Cloudinary Status Indicator */}
          {cloudinaryStatus ? (
            <div
              className={`flex items-center gap-2 rounded-xl p-2 text-xs border ${
                cloudinaryStatus.configured
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-800'
                  : 'border-amber-500/20 bg-amber-500/5 text-amber-800'
              }`}
              title={
                cloudinaryStatus.configured
                  ? `Cloudinary active (${cloudinaryStatus.cloudName || 'configured'})`
                  : 'Cloudinary not configured. Set credentials in server/.env'
              }
            >
              <Cloud size={14} className="shrink-0" />
              <div className="min-w-0 flex-1 truncate">
                <span className="font-medium">
                  {cloudinaryStatus.configured ? 'Cloudinary ready' : 'Cloudinary setup'}
                </span>
              </div>
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  cloudinaryStatus.configured ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
              />
            </div>
          ) : null}

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
      <div className="p-5 sm:p-8">
        <Outlet />
      </div>
    </div>
  );
}
