import { useState } from 'react';
import { api, getErrorMessage } from '../../services/api.js';

export function UploadField({ label, value, onUploaded }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    setBusy(true);
    setError('');
    try {
      const res = await api.post('/admin/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploaded(res.data.data.url);
    } catch (err) {
      setError(getErrorMessage(err, 'Upload failed. Check Cloudinary credentials.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4">
      <p className="text-sm">{label}</p>
      {value ? (
        <p className="mt-1 truncate text-xs text-muted" title={value}>
          Current: {value}
        </p>
      ) : null}
      <input type="file" accept="image/*,.pdf" className="mt-2 text-sm" onChange={onChange} disabled={busy} />
      {busy ? <p className="text-xs text-muted">Uploading…</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
