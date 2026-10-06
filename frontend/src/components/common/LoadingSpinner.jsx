import React from 'react';
export default function LoadingSpinner() {
  return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40 }}><div className="spinner"></div><div style={{ marginTop: 10 }}>Loading...</div></div>;
}
