import { useState } from 'react';
import { Copy, Check, X, Loader2, Bookmark, BookmarkCheck } from 'lucide-react';
import './UI.css';

// ─── Button ─────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', icon, disabled, loading, className = '', ...props }) {
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  return (
    <button
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={16} className="spinning" style={{ animation: 'spin 0.8s linear infinite' }} /> : icon}
      {children}
    </button>
  );
}

// ─── Card ───────────────────────────────────────────
export function Card({ children, gradient, className = '', ...props }) {
  return (
    <div className={`card ${gradient ? 'card-gradient' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}

// ─── Input ──────────────────────────────────────────
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className={`input ${error ? 'input-error' : ''} ${className}`} {...props} />
      {error && <span style={{ color: 'var(--accent-red)', fontSize: 'var(--font-xs)' }}>{error}</span>}
    </div>
  );
}

// ─── Textarea ───────────────────────────────────────
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <textarea className={`input textarea ${error ? 'input-error' : ''} ${className}`} {...props} />
      {error && <span style={{ color: 'var(--accent-red)', fontSize: 'var(--font-xs)' }}>{error}</span>}
    </div>
  );
}

// ─── Badge ──────────────────────────────────────────
export function Badge({ children, variant = 'primary', className = '' }) {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
}

// ─── Copy Button ────────────────────────────────────
export function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
      {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> {label}</>}
    </button>
  );
}

// ─── Save/Bookmark Button ───────────────────────────
export function SaveButton({ saved, onSave, size = 18 }) {
  return (
    <button
      className="btn btn-ghost btn-icon"
      onClick={onSave}
      title={saved ? 'Saved' : 'Save'}
      style={{ color: saved ? 'var(--accent-orange)' : 'var(--text-muted)' }}
    >
      {saved ? <BookmarkCheck size={size} /> : <Bookmark size={size} />}
    </button>
  );
}

// ─── Modal ──────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700 }}>{title}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Loader ─────────────────────────────────────────
export function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-container">
      <div className="loader-spinner" />
      <p className="loader-text">{text}</p>
    </div>
  );
}

// ─── Skeleton Card ──────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" style={{ width: '90%' }} />
      <div className="skeleton skeleton-text" style={{ width: '75%' }} />
      <div className="skeleton skeleton-text" style={{ width: '60%' }} />
    </div>
  );
}

// ─── Error Message ──────────────────────────────────
export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <X size={16} />
      <span>{message}</span>
      {onRetry && <button className="btn btn-ghost btn-sm" onClick={onRetry}>Retry</button>}
    </div>
  );
}

// ─── Tone Selector ──────────────────────────────────
export function ToneSelector({ value, onChange }) {
  const tones = [
    { key: 'funny', label: '😂 Funny' },
    { key: 'professional', label: '💼 Professional' },
    { key: 'viral', label: '🔥 Viral' },
    { key: 'motivational', label: '💪 Motivational' },
  ];
  return (
    <div className="tone-selector">
      {tones.map(t => (
        <button
          key={t.key}
          className={`tone-btn ${value === t.key ? 'active' : ''}`}
          onClick={() => onChange(t.key)}
          type="button"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
