import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../../services/api.js';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { UploadField } from '../../components/admin/UploadField.jsx';
import { MultiUploadField } from '../../components/admin/MultiUploadField.jsx';

function parseList(value) {
  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AdminResource({ title, path, fields, defaults }) {
  const { refresh } = usePortfolio();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaults);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    const res = await api.get(`/admin${path}`);
    setItems(res.data.data || []);
  }

  useEffect(() => {
    load().catch((err) => setError(getErrorMessage(err)));
  }, [path]);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toPayload() {
    const payload = { ...form };
    fields.forEach((field) => {
      if (field.type === 'list') payload[field.key] = parseList(form[field.key]);
      if (field.type === 'multiupload') payload[field.key] = Array.isArray(form[field.key]) ? form[field.key] : parseList(form[field.key]);
      if (field.type === 'checkbox') payload[field.key] = Boolean(form[field.key]);
      if (field.type === 'number') payload[field.key] = Number(form[field.key] || 0);
    });
    return payload;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      if (editing) await api.patch(`/admin${path}/${editing}`, toPayload());
      else await api.post(`/admin${path}`, toPayload());
      setForm(defaults);
      setEditing(null);
      await load();
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function onDelete(id) {
    if (!confirm('Delete this item?')) return;
    await api.delete(`/admin${path}/${id}`);
    await load();
    await refresh();
  }

  function onEdit(item) {
    setEditing(item._id);
    const next = { ...defaults };
    fields.forEach((field) => {
      if (field.type === 'list') next[field.key] = (item[field.key] || []).join('\n');
      else if (field.type === 'multiupload') next[field.key] = Array.isArray(item[field.key]) ? item[field.key] : [];
      else next[field.key] = item[field.key] ?? defaults[field.key];
    });
    setForm(next);
  }

  async function onMove(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    setItems(newItems);
    try {
      await api.patch(`/admin${path}/reorder`, { ids: newItems.map((i) => i._id) });
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to reorder items'));
      await load();
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <form onSubmit={onSubmit}>
        <h1 className="font-display text-3xl">{title}</h1>
        {fields.map((field) => (
          <div key={field.key} className="mt-4">
            {field.type === 'checkbox' ? (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(form[field.key])}
                  onChange={(e) => update(field.key, e.target.checked)}
                />
                {field.label}
              </label>
            ) : field.type === 'select' ? (
              <>
                <label className="text-sm">{field.label}</label>
                <select
                  className="mt-1 w-full rounded-xl border border-line px-3 py-2"
                  value={form[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </>
            ) : field.type === 'upload' ? (
              <UploadField
                label={field.label}
                value={form[field.key] || ''}
                folder={field.folder || 'portfolio'}
                onUploaded={(url) => update(field.key, url)}
              />
            ) : field.type === 'multiupload' ? (
              <MultiUploadField
                label={field.label}
                values={form[field.key] || []}
                folder={field.folder || 'portfolio/gallery'}
                onChange={(urls) => update(field.key, urls)}
              />
            ) : (
              <>
                <label className="text-sm">{field.label}</label>
                {field.type === 'textarea' || field.type === 'list' ? (
                  <textarea
                    rows={field.rows || 4}
                    className="mt-1 w-full rounded-xl border border-line px-3 py-2"
                    value={form[field.key] || ''}
                    onChange={(e) => update(field.key, e.target.value)}
                    placeholder={field.type === 'list' ? 'One item per line' : ''}
                  />
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    className="mt-1 w-full rounded-xl border border-line px-3 py-2"
                    value={form[field.key] ?? ''}
                    onChange={(e) => update(field.key, e.target.value)}
                  />
                )}
              </>
            )}
          </div>
        ))}
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        <div className="mt-5 flex gap-3">
          <Button>{editing ? 'Update' : 'Create'}</Button>
          {editing ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditing(null);
                setForm(defaults);
              }}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Existing ({items.length})
          </h2>
          <span className="text-xs text-muted">Order affects public display</span>
        </div>
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => {
            const isHidden = item.visible === false || item.published === false;
            return (
              <li
                key={item._id}
                className={`rounded-xl border p-4 transition-colors ${
                  editing === item._id
                    ? 'border-sage bg-cream/50 ring-1 ring-sage'
                    : 'border-line bg-paper'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">
                      {item.title || item.name || item.label || item.company || item.institution}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                      {item.category ? (
                        <span className="rounded bg-cream px-1.5 py-0.5">{item.category}</span>
                      ) : null}
                      {item.type ? (
                        <span className="rounded bg-cream px-1.5 py-0.5">{item.type}</span>
                      ) : null}
                      {item.featured ? (
                        <span className="rounded bg-sage/15 px-1.5 py-0.5 font-medium text-sage-dark">
                          Featured
                        </span>
                      ) : null}
                      {isHidden ? (
                        <span className="rounded bg-sand px-1.5 py-0.5 text-muted">
                          {item.published === false ? 'Draft' : 'Hidden'}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onMove(index, -1)}
                      title="Move up"
                      className="rounded p-1 text-xs text-muted hover:bg-cream hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={index === items.length - 1}
                      onClick={() => onMove(index, 1)}
                      title="Move down"
                      className="rounded p-1 text-xs text-muted hover:bg-cream hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      ▼
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex gap-3 text-sm">
                  <button
                    type="button"
                    className="font-medium text-sage-dark underline hover:text-ink"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-danger underline hover:opacity-80"
                    onClick={() => onDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
          {items.length === 0 ? (
            <li className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">
              No items created yet. Use the form on the left to add one.
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
