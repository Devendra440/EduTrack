import React from 'react';
export default function EmptyState({ title, subtitle, actionLabel, onAction }) {
  return <div style={{ textAlign: 'center', padding: 40 }}><h3 style={{ margin: '0 0 10px 0' }}>{title}</h3><p style={{ color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>{subtitle}</p>{actionLabel && <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>}</div>;
}
