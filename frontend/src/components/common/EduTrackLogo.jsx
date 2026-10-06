import React from 'react';

export default function EduTrackLogo({ size = 38, showText = true, textStyle = {}, style = {} }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, userSelect: 'none', ...style }}>
      <img
        src="/logo.png"
        alt="EduTrack Logo"
        style={{
          width: size,
          height: size,
          objectFit: 'cover',
          borderRadius: Math.max(6, Math.floor(size * 0.22)),
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          flexShrink: 0,
        }}
      />

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', ...textStyle }}>
          <span style={{ fontSize: size * 0.52, fontWeight: 800, letterSpacing: '-0.5px', color: 'inherit', lineHeight: 1.1 }}>
            EduTrack
          </span>
          <span style={{ fontSize: Math.max(10, size * 0.26), fontWeight: 600, opacity: 0.8, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Academic Portal
          </span>
        </div>
      )}
    </div>
  );
}
