import { useState, useRef } from 'react';
import {
  UploadCloud,
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { api, getErrorMessage } from '../../services/api.js';

export function MultiUploadField({
  label,
  values = [],
  onChange,
  folder = 'portfolio/gallery',
  helpText,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const fileInputRef = useRef(null);

  const list = Array.isArray(values) ? values : [];

  async function handleFilesUpload(filesList) {
    if (!filesList || !filesList.length) return;

    const files = Array.from(filesList);
    setBusy(true);
    setError('');

    const uploadedUrls = [];

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} exceeds 10MB limit and was skipped.`);
        continue;
      }

      const form = new FormData();
      form.append('file', file);

      try {
        const res = await api.post(`/admin/upload?folder=${encodeURIComponent(folder)}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const url = res.data?.data?.url || res.data?.data?.secureUrl;
        if (url) uploadedUrls.push(url);
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to upload some images to Cloudinary.'));
      }
    }

    if (uploadedUrls.length && onChange) {
      onChange([...list, ...uploadedUrls]);
    }

    setBusy(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeAt(index) {
    const updated = list.filter((_, i) => i !== index);
    onChange?.(updated);
  }

  function addManualUrl() {
    const trimmed = manualUrl.trim();
    if (!trimmed) return;
    onChange?.([...list, trimmed]);
    setManualUrl('');
  }

  function copyUrl(url, idx) {
    navigator.clipboard.writeText(url);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-ink">{label}</label>
        <span className="text-xs text-muted">{list.length} item{list.length === 1 ? '' : 's'}</span>
      </div>

      {helpText ? <p className="mt-0.5 text-xs text-muted">{helpText}</p> : null}

      {/* Thumbnails Grid */}
      {list.length ? (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {list.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative overflow-hidden rounded-xl border border-line bg-paper shadow-xs transition hover:border-ink/20"
            >
              <div className="aspect-video w-full overflow-hidden bg-cream/40">
                <img
                  src={url}
                  alt={`Gallery item ${idx + 1}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                  }}
                />
              </div>

              {/* Actions Overlay */}
              <div className="flex items-center justify-between border-t border-line/60 bg-paper/95 p-1.5 px-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded p-1 text-muted hover:text-ink transition"
                  title="View full image"
                >
                  <ExternalLink size={13} />
                </a>

                <button
                  type="button"
                  onClick={() => copyUrl(url, idx)}
                  className="rounded p-1 text-muted hover:text-ink transition"
                  title="Copy URL"
                >
                  {copiedIndex === idx ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                </button>

                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="rounded p-1 text-muted hover:text-danger transition"
                  title="Remove image"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFilesUpload(e.dataTransfer.files);
        }}
        onClick={() => !busy && fileInputRef.current?.click()}
        className={`group mt-3 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition cursor-pointer ${
          isDragging
            ? 'border-sage bg-sage/5 scale-[0.99]'
            : 'border-line/70 hover:border-line hover:bg-cream/20 bg-paper'
        } ${busy ? 'cursor-wait opacity-80' : ''}`}
      >
        {busy ? (
          <div className="flex flex-col items-center py-2">
            <Loader2 size={28} className="animate-spin text-sage" />
            <p className="mt-2 text-sm font-medium text-ink">Uploading to Cloudinary...</p>
            <p className="mt-0.5 text-xs text-muted">Processing files</p>
          </div>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream/60 text-muted transition group-hover:scale-105 group-hover:text-ink">
              <UploadCloud size={20} />
            </div>
            <p className="mt-2 text-xs font-medium text-ink">
              <span className="text-sage underline decoration-sage/40 underline-offset-2">
                Click to browse
              </span>{' '}
              or drag & drop multiple images
            </p>
            <p className="mt-0.5 text-[11px] text-muted">
              Select one or multiple images (up to 10MB each)
            </p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFilesUpload(e.target.files)}
        disabled={busy}
      />

      {/* Manual URL append */}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          className="w-full rounded-xl border border-line bg-paper px-3 py-1.5 text-xs focus:border-sage focus:outline-none"
          placeholder="Or paste an image URL and click Add"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addManualUrl();
            }
          }}
        />
        <button
          type="button"
          onClick={addManualUrl}
          disabled={!manualUrl.trim()}
          className="inline-flex items-center gap-1 rounded-xl border border-line bg-paper px-3 py-1.5 text-xs text-ink hover:bg-cream/40 disabled:opacity-40 transition"
        >
          <Plus size={13} /> Add
        </button>
      </div>

      {error ? (
        <div className="mt-2 flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/5 p-2.5 text-xs text-danger">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}
    </div>
  );
}
