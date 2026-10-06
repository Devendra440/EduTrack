import React from 'react';
export default function StatusBadge({ status }) {
  let color = 'gray';
  const s = status?.toLowerCase() || '';
  if (s.includes('upcoming') || s === 'a') color = 'blue';
  if (s.includes('ongoing') || s === 'b') color = 'cyan';
  if (s.includes('pending') || s === 'c') color = 'amber';
  if (s.includes('submitted') || s === 'pass' || s === 'a+' || s === 'active') color = 'green';
  if (s.includes('passed') || s === 'fail' || s === 'f') color = 'red';
  if (s === 'd') color = 'orange';
  return <span className={`badge badge-${color}`}>{status}</span>;
}
