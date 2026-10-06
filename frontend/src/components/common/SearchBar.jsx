import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
export default function SearchBar({ value, onChange, placeholder, onClear }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', maxWidth: 300 }}>
      <FiSearch style={{ position: 'absolute', left: 10, color: 'var(--text-secondary)' }} />
      <input className="input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ paddingLeft: 35, paddingRight: 35 }} />
      {value && <FiX onClick={onClear} style={{ position: 'absolute', right: 10, cursor: 'pointer', color: 'var(--text-secondary)' }} />}
    </div>
  );
}
