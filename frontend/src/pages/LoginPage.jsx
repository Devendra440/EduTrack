import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/common/Toast';
import EduTrackLogo from '../components/common/EduTrackLogo';
import { loginUser, requestForgotPassword } from '../services/userService';
import { FiBook, FiUsers, FiBarChart2, FiAward, FiKey, FiLock, FiMail, FiCheckCircle, FiHelpCircle } from 'react-icons/fi';
import { supabase } from '../services/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotReason, setForgotReason] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      showToast(error.message || 'Error signing in with Google', 'error');
    }
  };

  const handleRoleSelect = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser({ email: email.trim(), password });
      if (res.data && res.data.success) {
        localStorage.setItem('edutrack_auth', res.data.token);
        localStorage.setItem('edutrack_user', JSON.stringify(res.data.user));
        showToast(`Welcome back, ${res.data.user.fullName || 'User'}! (${res.data.user.role})`, 'success');
        navigate('/dashboard');
        return;
      }
    } catch (err) {
      // Fallback for demo logins if backend API unavailable
      const cleanEmail = email.trim().toLowerCase();
      let mockUser = null;

      if (cleanEmail === 'admin@gmail.com' && password === 'admin123') {
        mockUser = { email: 'admin@gmail.com', fullName: 'System Administrator', role: 'ADMIN' };
      } else if (cleanEmail === 'manager@gmail.com' && password === 'manager123') {
        mockUser = { email: 'manager@gmail.com', fullName: 'Credential Manager', role: 'CREDENTIAL_MANAGER' };
      } else if (cleanEmail === 'teacher@gmail.com' && password === 'teacher123') {
        mockUser = { email: 'teacher@gmail.com', fullName: 'Dr. Suresh Varma', role: 'TEACHER' };
      } else if (cleanEmail === 'student.rahul@gmail.com' && password === 'student123') {
        mockUser = { email: 'student.rahul@gmail.com', fullName: 'Rahul Kumar', role: 'STUDENT' };
      }

      if (mockUser) {
        localStorage.setItem('edutrack_auth', 'mock_token_' + mockUser.role);
        localStorage.setItem('edutrack_user', JSON.stringify(mockUser));
        showToast(`Welcome back, ${mockUser.fullName}!`, 'success');
        navigate('/dashboard');
        return;
      }

      setError(err.response?.data?.error || 'Invalid credentials. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitting(true);
    try {
      await requestForgotPassword({ email: forgotEmail, reason: forgotReason });
      showToast('Password reset request submitted successfully to Credential Manager!', 'success');
      setShowForgotModal(false);
      setForgotEmail('');
      setForgotReason('');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to submit password reset request', 'error');
    } finally {
      setForgotSubmitting(false);
    }
  };

  const features = [
    { icon: <FiUsers />, text: 'Manage Students & Branches' },
    { icon: <FiKey />, text: 'Credential Management & Roles' },
    { icon: <FiBook />, text: 'Subjects & Exam Schedules' },
    { icon: <FiBarChart2 />, text: 'Marks Posting & Results' },
    { icon: <FiAward />, text: 'Performance Analytics' },
  ];

  return (
    <div className="login-page">
      <div style={{ display: 'flex', width: '100%', maxWidth: 960, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: 'white' }}>

        {/* Left Panel — Branding */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
          padding: '48px 40px',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'between',
          minWidth: 0,
        }} className="no-print" id="login-branding">

          <div style={{ marginBottom: 32 }}>
            <EduTrackLogo size={48} showText={false} style={{ marginBottom: 16 }} />
            <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>EduTrack</h1>
            <p style={{ opacity: 0.88, fontSize: 15, lineHeight: 1.6 }}>
              Student Academic & Result Management System with Multi-Role Credential Administration.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.95 }}>
                <div style={{
                  width: 34, height: 34,
                  background: 'rgba(255,255,255,0.18)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0
                }}>{f.icon}</div>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, opacity: 0.85 }}>
            <FiCheckCircle style={{ color: '#4ade80' }} />
            <span>Multi-Role Authentication &amp; Live Audit Monitoring</span>
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div style={{
          width: 440,
          flexShrink: 0,
          background: 'white',
          padding: '44px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Account Sign In
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
              Enter your email address (@gmail.com) and password
            </p>
          </div>

          {/* Quick Role Selection Presets */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select System Role:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: 12, padding: '6px 8px', justifyContent: 'flex-start', border: email === 'admin@gmail.com' ? '2px solid var(--primary)' : '1px solid var(--border)' }}
                onClick={() => handleRoleSelect('admin@gmail.com', 'admin123')}
              >
                🛡️ Super Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: 12, padding: '6px 8px', justifyContent: 'flex-start', border: email === 'manager@gmail.com' ? '2px solid var(--primary)' : '1px solid var(--border)' }}
                onClick={() => handleRoleSelect('manager@gmail.com', 'manager123')}
              >
                🔑 Credential Manager
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: 12, padding: '6px 8px', justifyContent: 'flex-start', border: email === 'teacher@gmail.com' ? '2px solid var(--primary)' : '1px solid var(--border)' }}
                onClick={() => handleRoleSelect('teacher@gmail.com', 'teacher123')}
              >
                👨‍🏫 Teacher / Faculty
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: 12, padding: '6px 8px', justifyContent: 'flex-start', border: email === 'student.rahul@gmail.com' ? '2px solid var(--primary)' : '1px solid var(--border)' }}
                onClick={() => handleRoleSelect('student.rahul@gmail.com', 'student123')}
              >
                🎓 Student Portal
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="login-error" id="login-error" style={{ marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiMail /> Email Address
              </label>
              <input
                id="login-email"
                className="input"
                type="email"
                placeholder="username@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 0 }}>
                  <FiLock /> Password
                </label>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                id="login-password"
                className="input"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ marginTop: 6 }}
              />
            </div>

            <button
              id="login-btn"
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '11px', fontSize: 15, marginTop: 8, justifyContent: 'center' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
              <div style={{ padding: '0 10px', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Or continue with</div>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '11px', fontSize: 14, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8, background: 'white', color: '#333', border: '1px solid #ccc' }}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" width="18" height="18" />
              Sign in with Google
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-muted)' }}>
            EduTrack Academic Management Portal
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal" style={{ width: 440 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FiHelpCircle style={{ fontSize: 20, color: 'var(--primary)' }} />
                <span style={{ fontWeight: 700, fontSize: 18 }}>Request Password Reset</span>
              </div>
              <button className="modal-close" onClick={() => setShowForgotModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleForgotSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 16 }}>
                  Submit your registered email ending in @gmail.com. The Credential Manager will reset your password and send updated login credentials.
                </p>
                <div className="form-group">
                  <label className="form-label">Registered Email (@gmail.com)</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="user@gmail.com"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reason / Notes for Reset</label>
                  <textarea
                    className="input"
                    rows="3"
                    placeholder="e.g., Forgot my password / Need account unlock"
                    value={forgotReason}
                    onChange={e => setForgotReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForgotModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={forgotSubmitting}>
                  {forgotSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


