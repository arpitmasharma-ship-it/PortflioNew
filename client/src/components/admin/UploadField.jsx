import { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  FileText,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';
import { api, getErrorMessage } from '../../services/api.js';
import { isCloudinaryUrl } from '../../utils/cloudinary.js';

export function UploadField({
  label,
  value = '',
  onUploaded,
  accept = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf',
  folder = 'portfolio',
  helpText,
}) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef(null);

  const isPdf = value && (value.toLowerCase().endsWith('.pdf') || value.includes('/raw/upload/') || value.includes('application/pdf'));
  const isImage = value && !isPdf;

  async function handleFileUpload(file) {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    const form = new FormData();
    form.append('file', file);
    if (folder) form.append('folder', folder);

    setBusy(true);
    setError('');

    try {
      const res = await api.post(`/admin/upload?folder=${encodeURIComponent(folder)}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrl = res.data?.data?.url || res.data?.data?.secureUrl;
      if (uploadedUrl && onUploaded) {
        onUploaded(uploadedUrl);
      }
    } catch (err) {
      const msg = getErrorMessage(err, 'Upload failed. Check Cloudinary credentials.');
      setError(msg);
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function onFileInputChange(event) {
    const file = event.target.files?.[0];
    if (file) handleFileUpload(file);
  }

  function onDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }

  function onCopyUrl() {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function onClear() {
    if (onUploaded) onUploaded('');
    setError('');
  }

  const isCloudinaryMissing = error && error.toLowerCase().includes('cloudinary is not configured');

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-ink">{label}</label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink transition"
        >
          <LinkIcon size={12} />
          {showManualInput ? 'Hide URL input' : 'Paste URL directly'}
        </button>
      </div>

      {helpText ? <p className="mt-0.5 text-xs text-muted">{helpText}</p> : null}

      {/* Manual URL input fallback */}
      {showManualInput ? (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm focus:border-sage focus:outline-none"
            placeholder="https://res.cloudinary.com/... or any URL"
            value={value || ''}
            onChange={(e) => onUploaded?.(e.target.value)}
          />
          {value ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-xl border border-line px-3 py-2 text-xs text-muted hover:bg-cream/40 hover:text-ink"
            >
              Clear
            </button>
          ) : null}
        </div>
      ) : null}

      {/* Uploaded File Preview Card */}
      {value && !busy ? (
        <div className="mt-2.5 overflow-hidden rounded-2xl border border-line bg-paper shadow-xs">
          <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {isImage ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-cream/40">
                  <img
                    src={value}
                    alt={label || 'Uploaded preview'}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                      e.target.className = 'hidden';
                    }}
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-line bg-cream/60 text-muted">
                  <FileText size={28} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs font-medium text-ink">
                    {isPdf ? 'PDF Document' : 'Uploaded Image'}
                  </span>
                  {isCloudinaryUrl(value) ? (
                    <span className="rounded-md bg-sage/10 px-1.5 py-0.5 text-[10px] font-medium text-sage">
                      Cloudinary
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted" title={value}>
                  {value}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 self-end sm:self-center">
              <a
                href={value}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:bg-cream/50 hover:text-ink transition"
                title="Open in new tab"
              >
                <ExternalLink size={14} />
              </a>

              <button
                type="button"
                onClick={onCopyUrl}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-line px-2.5 text-xs text-muted hover:bg-cream/50 hover:text-ink transition"
                title="Copy URL"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex h-8 items-center rounded-lg border border-line px-2.5 text-xs text-muted hover:bg-cream/50 hover:text-ink transition"
                title="Replace file"
              >
                Replace
              </button>

              <button
                type="button"
                onClick={onClear}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted hover:border-danger/30 hover:bg-danger/10 hover:text-danger transition"
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Upload Dropzone */}
      {(!value || busy) ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !busy && fileInputRef.current?.click()}
          className={`group mt-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition cursor-pointer ${
            isDragging
              ? 'border-sage bg-sage/5 scale-[0.99]'
              : 'border-line/70 hover:border-line hover:bg-cream/20 bg-paper'
          } ${busy ? 'cursor-wait opacity-80' : ''}`}
        >
          {busy ? (
            <div className="flex flex-col items-center py-2">
              <Loader2 size={32} className="animate-spin text-sage" />
              <p className="mt-3 text-sm font-medium text-ink">Uploading to Cloudinary...</p>
              <p className="mt-0.5 text-xs text-muted">Optimizing and storing asset</p>
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream/60 text-muted transition group-hover:scale-105 group-hover:text-ink">
                <UploadCloud size={24} />
              </div>
              <p className="mt-3 text-sm font-medium text-ink">
                <span className="text-sage underline decoration-sage/40 underline-offset-2">
                  Click to browse
                </span>{' '}
                or drag and drop
              </p>
              <p className="mt-1 text-xs text-muted">
                Images (PNG, JPG, WebP, GIF, SVG) or PDF • up to 10MB
              </p>
            </>
          )}
        </div>
      ) : null}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onFileInputChange}
        disabled={busy}
      />

      {/* Error / Instructions Banner */}
      {error ? (
        <div className="mt-2.5 flex items-start gap-2.5 rounded-xl border border-danger/20 bg-danger/5 p-3 text-xs text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">{error}</p>
            {isCloudinaryMissing ? (
              <p className="mt-1 text-muted">
                Tip: Add <code className="bg-paper px-1 py-0.5 rounded font-mono text-[11px]">CLOUDINARY_CLOUD_NAME</code>, <code className="bg-paper px-1 py-0.5 rounded font-mono text-[11px]">CLOUDINARY_API_KEY</code>, and <code className="bg-paper px-1 py-0.5 rounded font-mono text-[11px]">CLOUDINARY_API_SECRET</code> to your <code className="bg-paper px-1 py-0.5 rounded font-mono text-[11px]">server/.env</code> file.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
