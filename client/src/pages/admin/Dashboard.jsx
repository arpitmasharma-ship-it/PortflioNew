import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data.data));
  }, []);

  const cards = [
    ['Projects', stats?.projects, '/admin/projects'],
    ['Skills', stats?.skills, '/admin/skills'],
    ['Experience', stats?.experience, '/admin/experience'],
    ['Education', stats?.education, '/admin/education'],
    ['Achievements', stats?.achievements, '/admin/achievements'],
    ['Journal posts', stats?.posts, '/admin/journal'],
    ['Unread messages', stats?.unreadMessages, '/admin/messages'],
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Overview</h1>
      <p className="mt-2 text-sm text-muted">A quiet place to keep the public site honest and up to date.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value, to]) => (
          <Link key={label} to={to} className="rounded-2xl border border-line bg-cream/40 p-5 hover:border-ink/20">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 font-display text-4xl">{value ?? '—'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
