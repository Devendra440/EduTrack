import React, { useEffect, useState } from 'react';
import { useToast } from '../components/common/Toast';
import {
  getUsers, createTeacherCredential, createStudentCredential,
  updateUserCredential, deleteUserCredential, changeUserPassword,
  getMonitoringStats, getAuditLogs, getResetRequests, fulfillResetRequest
} from '../services/userService';
import {
  FiUsers, FiKey, FiShield, FiActivity, FiPlus, FiEdit2,
  FiTrash2, FiLock, FiCheckCircle, FiRefreshCw, FiClock, FiUserCheck
} from 'react-icons/fi';

export default function CredentialsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('teachers');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ totalTeachers: 0, totalStudents: 0, pendingResets: 0, totalLogs: 0 });
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [resetRequests, setResetRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modals state
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showFulfillModal, setShowFulfillModal] = useState(false);

  // Form states
  const [teacherForm, setTeacherForm] = useState({ id: '', fullName: '', email: '', department: 'CSE', phone: '', password: '' });
  const [studentForm, setStudentForm] = useState({ id: '', studentId: '', fullName: '', email: '', branch: 'CSE', semester: '5th Semester', phone: '', password: '' });
  const [passTarget, setPassTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [fulfillTarget, setFulfillTarget] = useState(null);
  const [fulfillPass, setFulfillPass] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('edutrack_user') || '{}');

  const loadData = async () => {
    setLoading(true);
    try {
      const [tRes, sRes, statsRes, logsRes, reqsRes] = await Promise.allSettled([
        getUsers('TEACHER'),
        getUsers('STUDENT'),
        getMonitoringStats(),
        getAuditLogs(),
        getResetRequests()
      ]);

      if (tRes.status === 'fulfilled') setTeachers(tRes.value.data || []);
      if (sRes.status === 'fulfilled') setStudents(sRes.value.data || []);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data || {});
      if (logsRes.status === 'fulfilled') setAuditLogs(logsRes.value.data || []);
      if (reqsRes.status === 'fulfilled') setResetRequests(reqsRes.value.data || []);

    } catch (err) {
      showToast('Error loading credential data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Teacher
  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    try {
      if (teacherForm.id) {
        await updateUserCredential(teacherForm.id, teacherForm, currentUser);
        showToast('Teacher credential updated successfully!', 'success');
      } else {
        await createTeacherCredential(teacherForm, currentUser);
        showToast('Teacher credential created successfully!', 'success');
      }
      setShowTeacherModal(false);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save teacher credential', 'error');
    }
  };

  // Save Student
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (studentForm.id) {
        await updateUserCredential(studentForm.id, studentForm, currentUser);
        showToast('Student credential updated successfully!', 'success');
      } else {
        await createStudentCredential(studentForm, currentUser);
        showToast('Student credential created successfully!', 'success');
      }
      setShowStudentModal(false);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save student credential', 'error');
    }
  };

  // Delete User
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete credentials for ${name}?`)) return;
    try {
      await deleteUserCredential(id, currentUser);
      showToast(`Credential for ${name} deleted successfully`, 'success');
      loadData();
    } catch (err) {
      showToast('Failed to delete credential', 'error');
    }
  };

  // Change Password
  const handleChangePass = async (e) => {
    e.preventDefault();
    if (!passTarget || !newPassword) return;
    try {
      await changeUserPassword(passTarget.id, newPassword, currentUser);
      showToast(`Password updated for ${passTarget.fullName}!`, 'success');
      setShowPassModal(false);
      setNewPassword('');
      loadData();
    } catch (err) {
      showToast('Failed to change password', 'error');
    }
  };

  // Fulfill Reset
  const handleFulfillReset = async (e) => {
    e.preventDefault();
    if (!fulfillTarget) return;
    try {
      await fulfillResetRequest(fulfillTarget.id, fulfillPass || 'TempPass123', currentUser);
      showToast(`Reset request fulfilled for ${fulfillTarget.userEmail}!`, 'success');
      setShowFulfillModal(false);
      setFulfillPass('');
      loadData();
    } catch (err) {
      showToast('Failed to fulfill reset request', 'error');
    }
  };

  return (
    <div className="credentials-page page-container">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiShield style={{ color: 'var(--primary)' }} /> Credential Administration &amp; Monitoring
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Create teacher &amp; student credentials, manage password resets (@gmail.com), and monitor system activity.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={loadData} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiRefreshCw /> Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            <FiUserCheck />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{stats.totalTeachers || teachers.length}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Teacher Accounts</div>
          </div>
        </div>

        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16,185,129,0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            <FiUsers />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{stats.totalStudents || students.length}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Student Accounts</div>
          </div>
        </div>

        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            <FiKey />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{resetRequests.filter(r => r.status === 'Pending').length}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Pending Resets</div>
          </div>
        </div>

        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            <FiActivity />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{auditLogs.length}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Audit Activity Logs</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', display: 'flex', gap: 24, marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('teachers')}
          style={{
            padding: '12px 4px', background: 'none', border: 'none',
            borderBottom: activeTab === 'teachers' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'teachers' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'teachers' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          <FiUserCheck /> Teacher Credentials ({teachers.length})
        </button>

        <button
          onClick={() => setActiveTab('students')}
          style={{
            padding: '12px 4px', background: 'none', border: 'none',
            borderBottom: activeTab === 'students' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'students' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'students' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          <FiUsers /> Student Credentials ({students.length})
        </button>

        <button
          onClick={() => setActiveTab('resets')}
          style={{
            padding: '12px 4px', background: 'none', border: 'none',
            borderBottom: activeTab === 'resets' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'resets' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'resets' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          <FiKey /> Forgot Password Requests ({resetRequests.filter(r => r.status === 'Pending').length})
        </button>

        <button
          onClick={() => setActiveTab('monitoring')}
          style={{
            padding: '12px 4px', background: 'none', border: 'none',
            borderBottom: activeTab === 'monitoring' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'monitoring' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'monitoring' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          <FiActivity /> Live Audit Monitoring
        </button>
      </div>

      {/* TAB 1: Teachers */}
      {activeTab === 'teachers' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Teacher Accounts &amp; Login Credentials</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage faculty accounts with @gmail.com pattern</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setTeacherForm({ id: '', fullName: '', email: '', department: 'CSE', phone: '', password: '' });
                setShowTeacherModal(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <FiPlus /> Create Teacher Credential
            </button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Teacher Name</th>
                  <th>Registered Email (@gmail.com)</th>
                  <th>Department</th>
                  <th>Contact Phone</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 30 }}>
                      No teacher credentials found. Click "Create Teacher Credential" to add one.
                    </td>
                  </tr>
                ) : (
                  teachers.map((t) => (
                    <tr key={t.id || t.email}>
                      <td style={{ fontWeight: 600 }}>{t.fullName}</td>
                      <td>
                        <span style={{ background: 'var(--surface-hover)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12.5 }}>
                          {t.email}
                        </span>
                      </td>
                      <td>{t.department || 'Academic'}</td>
                      <td>{t.phone || 'N/A'}</td>
                      <td>
                        <span className={`badge ${t.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                          {t.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: 12 }}
                            title="Change Password"
                            onClick={() => { setPassTarget(t); setShowPassModal(true); }}
                          >
                            <FiLock /> Password
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: 12 }}
                            title="Edit Details"
                            onClick={() => {
                              setTeacherForm({
                                id: t.id,
                                fullName: t.fullName,
                                email: t.email,
                                department: t.department || 'CSE',
                                phone: t.phone || '',
                                password: t.password || ''
                              });
                              setShowTeacherModal(true);
                            }}
                          >
                            <FiEdit2 /> Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '4px 8px', fontSize: 12 }}
                            title="Delete Credential"
                            onClick={() => handleDeleteUser(t.id, t.fullName)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Students */}
      {activeTab === 'students' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Student Credentials &amp; Portal Login</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage student login accounts with @gmail.com emails</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setStudentForm({ id: '', studentId: '', fullName: '', email: '', branch: 'CSE', semester: '5th Semester', phone: '', password: '' });
                setShowStudentModal(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <FiPlus /> Create Student Credential
            </button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Email Address (@gmail.com)</th>
                  <th>Branch &amp; Semester</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 30 }}>
                      No student credentials found. Click "Create Student Credential" to add one.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id || s.studentId || s.email}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{s.studentId || 'N/A'}</td>
                      <td style={{ fontWeight: 600 }}>{s.fullName}</td>
                      <td>
                        <span style={{ background: 'var(--surface-hover)', padding: '4px 8px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12.5 }}>
                          {s.email}
                        </span>
                      </td>
                      <td>{s.branch} ({s.semester})</td>
                      <td>
                        <span className="badge badge-success">{s.status || 'Active'}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: 12 }}
                            onClick={() => { setPassTarget(s); setShowPassModal(true); }}
                          >
                            <FiLock /> Password
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: 12 }}
                            onClick={() => {
                              setStudentForm({
                                id: s.id,
                                studentId: s.studentId || '',
                                fullName: s.fullName,
                                email: s.email,
                                branch: s.branch || 'CSE',
                                semester: s.semester || '5th Semester',
                                phone: s.phone || '',
                                password: s.password || ''
                              });
                              setShowStudentModal(true);
                            }}
                          >
                            <FiEdit2 /> Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '4px 8px', fontSize: 12 }}
                            onClick={() => handleDeleteUser(s.id, s.fullName)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Forgot Password Requests */}
      {activeTab === 'resets' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Forgot Password &amp; Reset Queue</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Review and fulfill user password reset requests</p>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Target Email (@gmail.com)</th>
                  <th>User Role</th>
                  <th>Reason / Message</th>
                  <th>Requested At</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {resetRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 30 }}>
                      No password reset requests pending.
                    </td>
                  </tr>
                ) : (
                  resetRequests.map((r) => (
                    <tr key={r.id || r.userEmail}>
                      <td style={{ fontWeight: 600 }}>{r.userEmail}</td>
                      <td><span className="badge badge-info">{r.userRole || 'USER'}</span></td>
                      <td>{r.reason || 'Forgot password request'}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {r.requestedAt ? new Date(r.requestedAt).toLocaleString() : 'Recent'}
                      </td>
                      <td>
                        <span className={`badge ${r.status === 'Fulfilled' ? 'badge-success' : 'badge-warning'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {r.status === 'Pending' ? (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '4px 10px', fontSize: 12 }}
                            onClick={() => { setFulfillTarget(r); setShowFulfillModal(true); }}
                          >
                            <FiCheckCircle /> Fulfill Reset
                          </button>
                        ) : (
                          <span style={{ fontSize: 12, color: 'var(--success)' }}>✓ Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Live Audit Monitoring */}
      {activeTab === 'monitoring' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Live Credential &amp; Security Audit Feed</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Real-time audit log of account creation, logins, updates, and password changes</p>
            </div>
            <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: 13 }}>
              ● Monitoring Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {auditLogs.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 30 }}>
                No audit logs recorded yet. Action history will appear here live.
              </div>
            ) : (
              auditLogs.map((log, i) => (
                <div
                  key={log.id || i}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', background: 'var(--surface-hover)', borderRadius: 8,
                    borderLeft: `4px solid ${log.status === 'SUCCESS' ? 'var(--success)' : log.status === 'FAILED' ? 'var(--danger)' : 'var(--warning)'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <FiClock />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{log.details || log.action}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Operator: <strong style={{ color: 'var(--text-primary)' }}>{log.performedBy}</strong> ({log.performedByRole}) &nbsp;•&nbsp; Target: {log.targetUser}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${log.status === 'SUCCESS' ? 'badge-success' : 'badge-danger'}`}>
                      {log.status}
                    </span>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Just now'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Teacher Modal */}
      {showTeacherModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal" style={{ width: 480 }}>
            <div className="modal-header">
              <span style={{ fontWeight: 700, fontSize: 18 }}>
                {teacherForm.id ? 'Edit Teacher Credential' : 'Create New Teacher Credential'}
              </span>
              <button className="modal-close" onClick={() => setShowTeacherModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveTeacher}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="e.g., Dr. Suresh Varma"
                    value={teacherForm.fullName}
                    onChange={e => setTeacherForm({ ...teacherForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address (@gmail.com)</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="teacher.name@gmail.com"
                    value={teacherForm.email}
                    onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="input"
                    value={teacherForm.department}
                    onChange={e => setTeacherForm({ ...teacherForm, department: e.target.value })}
                  >
                    <option value="CSE">Computer Science &amp; Engineering</option>
                    <option value="IT">Information Technology</option>
                    <option value="ECE">Electronics &amp; Comm Engineering</option>
                    <option value="EEE">Electrical &amp; Electronics</option>
                    <option value="ME">Mechanical Engineering</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="9876500003"
                    value={teacherForm.phone}
                    onChange={e => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                  />
                </div>
                {!teacherForm.id && (
                  <div className="form-group">
                    <label className="form-label">Default Password</label>
                    <input
                      className="input"
                      type="password"
                      placeholder="teacher123"
                      value={teacherForm.password}
                      onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTeacherModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Credential</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {showStudentModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal" style={{ width: 480 }}>
            <div className="modal-header">
              <span style={{ fontWeight: 700, fontSize: 18 }}>
                {studentForm.id ? 'Edit Student Credential' : 'Create New Student Credential'}
              </span>
              <button className="modal-close" onClick={() => setShowStudentModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveStudent}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Student ID</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="e.g., ST111"
                    value={studentForm.studentId}
                    onChange={e => setStudentForm({ ...studentForm, studentId: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="e.g., Vikram Sharma"
                    value={studentForm.fullName}
                    onChange={e => setStudentForm({ ...studentForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Student Email (@gmail.com)</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="student.vikram@gmail.com"
                    value={studentForm.email}
                    onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Branch</label>
                    <select
                      className="input"
                      value={studentForm.branch}
                      onChange={e => setStudentForm({ ...studentForm, branch: e.target.value })}
                    >
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="ME">ME</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <select
                      className="input"
                      value={studentForm.semester}
                      onChange={e => setStudentForm({ ...studentForm, semester: e.target.value })}
                    >
                      <option value="1st Semester">1st Sem</option>
                      <option value="3rd Semester">3rd Sem</option>
                      <option value="5th Semester">5th Sem</option>
                      <option value="7th Semester">7th Sem</option>
                    </select>
                  </div>
                </div>
                {!studentForm.id && (
                  <div className="form-group">
                    <label className="form-label">Initial Password</label>
                    <input
                      className="input"
                      type="password"
                      placeholder="student123"
                      value={studentForm.password}
                      onChange={e => setStudentForm({ ...studentForm, password: e.target.value })}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStudentModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Credential</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPassModal && passTarget && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal" style={{ width: 400 }}>
            <div className="modal-header">
              <span style={{ fontWeight: 700, fontSize: 18 }}>Reset Password</span>
              <button className="modal-close" onClick={() => setShowPassModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleChangePass}>
              <div className="modal-body">
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 14 }}>
                  Resetting password for: <strong>{passTarget.fullName}</strong> ({passTarget.email})
                </p>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPassModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fulfill Reset Modal */}
      {showFulfillModal && fulfillTarget && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal" style={{ width: 420 }}>
            <div className="modal-header">
              <span style={{ fontWeight: 700, fontSize: 18 }}>Fulfill Password Reset</span>
              <button className="modal-close" onClick={() => setShowFulfillModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleFulfillReset}>
              <div className="modal-body">
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 14 }}>
                  Issue new password for user: <strong>{fulfillTarget.userEmail}</strong>
                </p>
                <div className="form-group">
                  <label className="form-label">New Temporary Password</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Temp12345"
                    value={fulfillPass}
                    onChange={e => setFulfillPass(e.target.value)}
                  />
                  <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                    Leave blank to auto-generate a random secure password.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowFulfillModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm &amp; Reset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


