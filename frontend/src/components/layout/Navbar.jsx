import React, { useEffect, useState } from 'react';
import { FiBell, FiLogOut, FiSearch, FiMenu, FiUser, FiShield } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { getNotifications } from '../../services/dashboardService';
import { supabase } from '../../services/supabaseClient';

export default function Navbar({ toggle }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [notifications, setNotifications] = useState([]);

  const user = JSON.parse(localStorage.getItem('edutrack_user') || '{"fullName":"Admin","role":"ADMIN","email":"admin@gmail.com"}');

  useEffect(() => {
    getNotifications().then(res => setNotifications(res.data)).catch(() => {});
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('edutrack_auth');
    localStorage.removeItem('edutrack_user');
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return { label: 'Super Admin', color: 'var(--danger)' };
      case 'CREDENTIAL_MANAGER': return { label: 'Credential Manager', color: 'var(--primary)' };
      case 'TEACHER': return { label: 'Faculty / Teacher', color: 'var(--success)' };
      case 'STUDENT': return { label: 'Student', color: 'var(--warning)' };
      default: return { label: role || 'User', color: 'var(--primary)' };
    }
  };

  const badge = getRoleBadge(user.role);

  return (
    <div className="navbar no-print" style={{ height: 'var(--navbar-height)', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <FiMenu onClick={toggle} style={{ cursor: 'pointer', fontSize: 20 }} />
        <span style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: 16 }}>
          {pathname.split('/')[1] ? pathname.split('/')[1].replace('-', ' ') : 'Dashboard'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <FiBell style={{ fontSize: 18 }} />
          {notifications.length > 0 && (
            <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--danger)', color: 'white', fontSize: 10, borderRadius: '50%', padding: '2px 5px', fontWeight: 700 }}>
              {notifications.length}
            </span>
          )}
        </div>

        {/* Logged in User Profile Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 10px', background: 'var(--surface-hover)', borderRadius: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{user.fullName || 'Administrator'}</span>
            <span style={{ fontSize: 11, color: badge.color, fontWeight: 600 }}>{badge.label}</span>
          </div>
          <button
            onClick={logout}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4, marginLeft: 6 }}
            title="Sign Out"
          >
            <FiLogOut style={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
