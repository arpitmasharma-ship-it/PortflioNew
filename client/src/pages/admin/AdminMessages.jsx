import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { formatDate } from '../../utils/format.js';

export default function AdminMessages() {
  const [items, setItems] = useState([]);

  async function load() {
    const res = await api.get('/admin/messages');
    setItems(res.data.data || []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl">Messages</h1>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item._id} className={`rounded-2xl border p-5 ${item.read ? 'border-line' : 'border-sage bg-cream/40'}`}>
            <p className="font-medium">
              {item.subject} · {item.inquiryType}
            </p>
            <p className="text-sm text-muted">
              {item.name} · {item.email} · {formatDate(item.createdAt, { dateStyle: 'medium' })}
            </p>
            <p className="mt-3 whitespace-pre-line text-sm leading-6">{item.message}</p>
            <div className="mt-3 flex gap-3 text-sm">
              {!item.read ? (
                <button
                  type="button"
                  className="underline"
                  onClick={async () => {
                    await api.patch(`/admin/messages/${item._id}/read`);
                    load();
                  }}
                >
                  Mark read
                </button>
              ) : null}
              <button
                type="button"
                className="text-danger underline"
                onClick={async () => {
                  await api.delete(`/admin/messages/${item._id}`);
                  load();
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 ? <p className="mt-6 text-muted">No messages yet.</p> : null}
    </div>
  );
}
