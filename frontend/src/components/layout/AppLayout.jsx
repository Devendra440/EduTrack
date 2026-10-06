import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, transition: 'opacity 0.3s ease' }} 
        />
      )}

      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} isMobile={isMobile} />
      
      <div className="main-content" style={{ 
        flex: 1, 
        marginLeft: isMobile ? '0' : (sidebarOpen ? 'var(--sidebar-width)' : '0'), 
        width: isMobile ? '100%' : `calc(100% - ${sidebarOpen ? 'var(--sidebar-width)' : '0'})`,
        transition: 'var(--transition)', 
        display: 'flex', 
        flexDirection: 'column',
        minWidth: 0 // critical for child tables to not overflow
      }}>
        <Navbar toggle={() => setSidebarOpen(!sidebarOpen)} />
        <div style={{ padding: isMobile ? '16px' : '24px', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
