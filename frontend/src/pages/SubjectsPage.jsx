import React, { useState, useEffect } from 'react';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../services/subjectService';
import { useToast } from '../components/common/Toast';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ subjectCode: '', subjectName: '', branch: 'CSE', semester: 1, credits: 3, academicYear: '' });
  
  const { showToast } = useToast();
  const user = JSON.parse(localStorage.getItem('edutrack_user') || '{}');
  const role = user.role || '';
  const canEdit = role !== 'STUDENT';

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await getSubjects({ search, branch: branchFilter, semester: semesterFilter });
      setSubjects(res.data);
    } catch (err) {
      showToast('Error loading subjects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubjects(); }, [search, branchFilter, semesterFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSubject(editingId, formData);
        showToast('Subject updated successfully');
      } else {
        await createSubject(formData);
        showToast('Subject created successfully');
      }
      setModalOpen(false);
      fetchSubjects();
    } catch (err) {
      showToast('Error saving subject', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubject(deleteConfirm);
      showToast('Subject deleted successfully');
      setDeleteConfirm(null);
      fetchSubjects();
    } catch (err) {
      showToast('Error deleting subject', 'error');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ subjectCode: '', subjectName: '', branch: 'CSE', semester: 1, credits: 3, academicYear: '' });
    setModalOpen(true);
  };

  const clearFilters = () => {
    setSearch(''); setBranchFilter(''); setSemesterFilter('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Subjects</h2>
        {canEdit && (
          <button id="add-subject-btn" className="btn btn-primary" onClick={openAddModal}><FiPlus /> Add Subject</button>
        )}
      </div>

      <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 15, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <FiSearch style={{ position: 'absolute', left: 10, top: 12, color: 'var(--text-secondary)' }} />
          <input id="subject-search" className="input" placeholder="Search by code or name..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 35 }} />
        </div>
        <select id="subject-branch-filter" className="input" style={{ width: 150 }} value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
          <option value="">All Branches</option>
          <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option>
        </select>
        <select className="input" style={{ width: 150 }} value={semesterFilter} onChange={e => setSemesterFilter(e.target.value)}>
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s===1?'1st Semester':s===2?'2nd Semester':s===3?'3rd Semester':s+'th Semester'}>Semester {s}</option>)}
        </select>
        <button className="btn btn-secondary" onClick={clearFilters}><FiX /> Clear</button>
      </div>

      <div className="card table-container">
        {loading ? <LoadingSpinner /> : subjects.length === 0 ? <EmptyState title="No subjects found" /> : (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Credits</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s._id || s.id}>
                  <td>{s.subjectCode}</td>
                  <td>{s.subjectName}</td>
                  <td>{s.branch}</td>
                  <td>{s.semester}</td>
                  <td>{s.credits}</td>
                  {canEdit && (
                    <td style={{ display: 'flex', gap: 10 }}>
                      <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => { setEditingId(s._id || s.id); setFormData(s); setModalOpen(true); }}><FiEdit2 style={{ color: 'var(--warning)' }} /></button>
                      <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setDeleteConfirm(s._id || s.id)}><FiTrash2 style={{ color: 'var(--danger)' }} /></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Subject" : "Add Subject"}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <input id="subject-code-input" className="input" placeholder="Subject Code (e.g. CS101)" value={formData.subjectCode} onChange={e => setFormData({...formData, subjectCode: e.target.value})} required />
          <input id="subject-name-input" className="input" placeholder="Subject Name" value={formData.subjectName} onChange={e => setFormData({...formData, subjectName: e.target.value})} required />
          <select id="subject-branch-select" className="input" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} required>
            <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option>
          </select>
          <select id="subject-semester-select" className="input" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} required>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s===1?'1st Semester':s===2?'2nd Semester':s===3?'3rd Semester':s+'th Semester'}>Semester {s}</option>)}
          </select>
          <input id="subject-credits-input" className="input" type="number" min="1" max="6" placeholder="Credits" value={formData.credits} onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})} required />
          <input id="subject-year-input" className="input" placeholder="Academic Year" value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})} required />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button id="save-subject-btn" type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Subject" message="Are you sure you want to delete this subject?" onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}


