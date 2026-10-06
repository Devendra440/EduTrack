import React from 'react';
export default function StatsCard({ title, value, subtitle, icon, color, trend }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius)', background: `var(--${color}-light)`, color: `var(--${color})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{icon}</div>
      <div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</div>}
      </div>
    </div>
  );
}
