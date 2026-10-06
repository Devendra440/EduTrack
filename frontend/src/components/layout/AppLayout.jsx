import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout() {
  const [open, setOpen] = useState(window.innerWidth > 768);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setOpen(false);
      else setOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <Sidebar open={open} />
      <div className="main-content" style={{ flex: 1, marginLeft: open ? 'var(--sidebar-width)' : '0', transition: 'var(--transition)', display: 'flex', flexDirection: 'column' }}>
        <Navbar toggle={() => setOpen(!open)} />
        <div style={{ padding: 24, flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
