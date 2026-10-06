import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import EduTrackLogo from '../common/EduTrackLogo';
import {
  FiHome, FiUsers, FiBook, FiCalendar,
  FiFileText, FiBarChart2, FiAward, FiSettings,
  FiClock, FiEdit3, FiShield, FiKey
} from 'react-icons/fi';

const navGroups = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    ]
  },
  {
    label: 'Academic',
    items: [
      { name: 'Students',  path: '/students',  icon: <FiUsers /> },
      { name: 'Subjects',  path: '/subjects',  icon: <FiBook /> },
      { name: 'Schedules', path: '/schedules', icon: <FiCalendar /> },
      { name: 'Marks',     path: '/marks',     icon: <FiEdit3 /> },
      { name: 'Results',   path: '/results',   icon: <FiFileText /> },
    ]
  },
  {
    label: 'Performance',
    items: [
      { name: 'Result History', path: '/results/history', icon: <FiClock /> },
      { name: 'Top Performers', path: '/performance',     icon: <FiAward /> },
    ]
  },
  {
    label: 'Administration & Security',
    items: [
      { name: 'Credentials & Monitoring', path: '/credentials', icon: <FiShield /> },
    ]
  }
];

export default function Sidebar({ open, setOpen, isMobile }) {
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem('edutrack_user') || '{}');
  const role = user.role || '';

  const isActive = (path) => {
    if (path === '/results' && pathname === '/results') return true;
    if (path === '/results/history' && pathname === '/results/history') return true;
    if (path !== '/results' && path !== '/results/history') {
      return pathname.startsWith(path);
    }
    return false;
  };

  const getFilteredGroups = () => {
    if (role === 'ADMIN') return navGroups;
    
    return navGroups.map(group => {
      let filteredItems = group.items;
      
      if (role === 'CREDENTIAL_MANAGER') {
        filteredItems = filteredItems.filter(item => 
          ['/dashboard', '/students', '/credentials'].includes(item.path)
        );
      } else if (role === 'TEACHER') {
        filteredItems = filteredItems.filter(item => 
          item.path !== '/credentials'
        );
      } else if (role === 'STUDENT') {
        filteredItems = filteredItems.filter(item => 
          ['/dashboard', '/subjects', '/schedules', '/results', '/results/history', '/performance'].includes(item.path)
        );
      }
      
      return { ...group, items: filteredItems };
    }).filter(group => group.items.length > 0);
  };

  const filteredNavGroups = getFilteredGroups();

  const handleItemClick = () => {
    if (isMobile && setOpen) {
      setOpen(false);
    }
  };

  return (
    <div
      className="sidebar no-print"
      style={{
        width: isMobile ? '250px' : (open ? 'var(--sidebar-width)' : '0px'),
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: isMobile ? 'fixed' : 'relative',
        left: isMobile ? (open ? 0 : '-250px') : 0,
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        boxShadow: isMobile && open ? '0 0 20px rgba(0,0,0,0.5)' : 'none'
      }}
    >
      {/* Brand Header with Custom Logo */}
      <div className="sidebar-brand" style={{ padding: '20px 24px' }}>
        <EduTrackLogo size={34} textStyle={{ color: 'var(--text-primary)' }} />
      </div>

      {/* Nav Groups */}
      <nav className="sidebar-nav">
        {filteredNavGroups.map((group) => (
          <div key={group.label}>
            <div className="sidebar-section-label">{group.label}</div>
            {group.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleItemClick}
                className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span className="sidebar-item-label">{item.name}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        EduTrack v1.0 &nbsp;·&nbsp; Academic Management Portal
      </div>
    </div>
  );
}
