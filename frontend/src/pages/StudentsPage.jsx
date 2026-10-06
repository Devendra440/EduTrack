import React, { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/studentService';
import { useToast } from '../components/common/Toast';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    studentId: '', fullName: '', email: '', phone: '', gender: 'Male',
    dateOfBirth: '', branch: 'CSE', semester: 1, academicYear: '', admissionYear: ''
  });

  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('edutrack_user') || '{}');
  const role = user.role || '';
  const canEdit = ['ADMIN', 'CREDENTIAL_MANAGER'].includes(role);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getStudents({ search, branch: branchFilter, semester: semesterFilter });
      setStudents(res.data);
    } catch (err) {
      showToast('Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, [search, branchFilter, semesterFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateStudent(editingId, formData);
        showToast('Student updated successfully');
      } else {
        await createStudent(formData);
        showToast('Student created successfully');
      }
      setModalOpen(false);
      fetchStudents();
    } catch (err) {
      showToast('Error saving student', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStudent(deleteConfirm);
      showToast('Student deleted successfully');
      setDeleteConfirm(null);
      fetchStudents();
    } catch (err) {
      showToast('Error deleting student', 'error');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ studentId: '', fullName: '', email: '', phone: '', gender: 'Male', dateOfBirth: '', branch: 'CSE', semester: 1, academicYear: '', admissionYear: '' });
    setModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingId(s._id || s.id);
    setFormData({ ...s, dateOfBirth: s.dateOfBirth ? s.dateOfBirth.split('T')[0] : '' });
    setModalOpen(true);
  };

  const clearFilters = () => {
    setSearch('');
    setBranchFilter('');
    setSemesterFilter('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Students <span className="badge badge-blue" style={{ fontSize: 14 }}>{students.length}</span></h2>
        {canEdit && (
          <button id="add-student-btn" className="btn btn-primary" onClick={openAddModal}><FiPlus /> Add Student</button>
        )}
      </div>

      <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 15, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <FiSearch style={{ position: 'absolute', left: 10, top: 12, color: 'var(--text-secondary)' }} />
          <input id="student-search" className="input" placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 35 }} />
        </div>
        <select id="student-branch-filter" className="input" style={{ width: 150 }} value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
          <option value="">All Branches</option>
          <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option><option value="EEE">EEE</option><option value="ME">ME</option><option value="CE">CE</option>
        </select>
        <select className="input" style={{ width: 150 }} value={semesterFilter} onChange={e => setSemesterFilter(e.target.value)}>
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s===1?'1st Semester':s===2?'2nd Semester':s===3?'3rd Semester':s+'th Semester'}>Semester {s}</option>)}
        </select>
        <button className="btn btn-secondary" onClick={clearFilters}><FiX /> Clear</button>
      </div>

      <div className="card table-container">
        {loading ? <LoadingSpinner /> : students.length === 0 ? <EmptyState title="No students found" subtitle="Try adjusting your search filters." actionLabel="Clear Filters" onAction={clearFilters} /> : (
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Email</th>
                <th>Academic Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id || s.id}>
                  <td>{s.studentId}</td>
                  <td>{s.fullName}</td>
                  <td>{s.branch}</td>
                  <td>{s.semester}</td>
                  <td>{s.email}</td>
                  <td>{s.academicYear}</td>
                  <td><StatusBadge status={s.status || 'Active'} /></td>
                  <td style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => navigate(`/students/${s._id || s.id}`)}><FiEye /></button>
                    {canEdit && (
                      <>
                        <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => openEditModal(s)}><FiEdit2 style={{ color: 'var(--warning)' }} /></button>
                        <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setDeleteConfirm(s._id || s.id)}><FiTrash2 style={{ color: 'var(--danger)' }} /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Student" : "Add Student"}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <input id="student-id-input" className="input" placeholder="Student ID" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} required />
            <input id="student-name-input" className="input" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
            <input id="student-email-input" className="input" type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            <input id="student-phone-input" className="input" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <select id="student-gender-select" className="input" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
              <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
            </select>
            <input id="student-dob-input" className="input" type="date" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
            <select id="student-branch-select" className="input" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} required>
              <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option><option value="EEE">EEE</option><option value="ME">ME</option><option value="CE">CE</option>
            </select>
            <select id="student-semester-select" className="input" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} required>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s===1?'1st Semester':s===2?'2nd Semester':s===3?'3rd Semester':s+'th Semester'}>{s}{s===1?'st':s===2?'nd':s===3?'rd':'th'} Semester</option>)}
            </select>
            <input id="student-year-input" className="input" placeholder="Academic Year (e.g. 2023-24)" value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})} required />
            <input id="student-admission-input" className="input" type="number" placeholder="Admission Year (e.g. 2023)" value={formData.admissionYear} onChange={e => setFormData({...formData, admissionYear: e.target.value})} required />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button id="save-student-btn" type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Student" message="Are you sure you want to delete this student?" onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}


