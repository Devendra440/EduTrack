import React, { useState, useEffect } from 'react';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '../services/scheduleService';
import { getSubjects } from '../services/subjectService';
import { useToast } from '../components/common/Toast';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { FiEdit2, FiTrash2, FiPlus, FiCalendar, FiSave, FiX, FiClock } from 'react-icons/fi';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [branchFilter, setBranchFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [subjectsOptions, setSubjectsOptions] = useState([]);

  const [formData, setFormData] = useState({
    examName: '', examType: 'Mid-Term', branch: 'CSE', semester: 1, subjectId: '',
    examDate: '', startTime: '', endTime: '', marksPostingStartDate: '', marksPostingDeadline: ''
  });

  const { showToast } = useToast();
  const user = JSON.parse(localStorage.getItem('edutrack_user') || '{}');
  const role = user.role || '';
  const canEdit = role !== 'STUDENT';

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await getSchedules({ branch: branchFilter, semester: semesterFilter, examType: examTypeFilter });
      setSchedules(res.data);
    } catch (err) {
      showToast('Error loading schedules', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchedules(); }, [branchFilter, semesterFilter, examTypeFilter]);

  useEffect(() => {
    if (formData.branch && formData.semester) {
      getSubjects({ branch: formData.branch, semester: formData.semester })
        .then(res => setSubjectsOptions(res.data))
        .catch(() => setSubjectsOptions([]));
    }
  }, [formData.branch, formData.semester]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSchedule(editingId, formData);
        showToast('Schedule updated successfully', 'success');
      } else {
        await createSchedule(formData);
        showToast('Schedule created successfully', 'success');
      }
      setModalOpen(false);
      fetchSchedules();
    } catch (err) {
      showToast('Error saving schedule', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSchedule(deleteConfirm);
      showToast('Schedule deleted successfully', 'success');
      setDeleteConfirm(null);
      fetchSchedules();
    } catch (err) {
      showToast('Error deleting schedule', 'error');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ examName: '', examType: 'Mid-Term', branch: 'CSE', semester: 1, subjectId: '', examDate: '', startTime: '', endTime: '', marksPostingStartDate: '', marksPostingDeadline: '' });
    setModalOpen(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2><FiCalendar style={{ color: 'var(--primary)', marginRight: 8 }} /> Exam Schedules</h2>
        {canEdit && (
          <button id="add-schedule-btn" className="btn btn-primary" onClick={openAddModal} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <FiPlus /> Create Schedule
          </button>
        )}
      </div>

      <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 15, flexWrap: 'wrap' }}>
        <select className="input" style={{ width: 160 }} value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
          <option value="">All Branches</option>
          <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option><option value="EEE">EEE</option><option value="ME">ME</option>
        </select>
        <select className="input" style={{ width: 160 }} value={semesterFilter} onChange={e => setSemesterFilter(e.target.value)}>
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s===1?'1st Semester':s===2?'2nd Semester':s===3?'3rd Semester':s+'th Semester'}>Semester {s}</option>)}
        </select>
        <select className="input" style={{ width: 160 }} value={examTypeFilter} onChange={e => setExamTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="Mid-Term">Mid-Term</option><option value="End-Semester">End-Semester</option>
        </select>
      </div>

      <div className="card table-container">
        {loading ? <LoadingSpinner /> : schedules.length === 0 ? <EmptyState title="No schedules found" /> : (
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Branch</th>
                <th>Sem</th>
                <th>Exam Type</th>
                <th>Exam Date</th>
                <th>Time</th>
                <th>Marks Deadline</th>
                <th>Status</th>
                {canEdit && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {schedules.map(s => (
                <tr key={s._id || s.id}>
                  <td style={{ fontWeight: 600 }}>{s.subject?.subjectName || s.subjectName || s.subjectId}</td>
                  <td>{s.branch}</td>
                  <td>{s.semester}</td>
                  <td><span className="badge badge-info">{s.examType}</span></td>
                  <td>{s.examDate ? s.examDate.split('T')[0] : ''}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.startTime} - {s.endTime}</td>
                  <td style={{ fontSize: 13 }}>{s.marksPostingDeadline ? s.marksPostingDeadline.split('T')[0] : ''}</td>
                  <td><StatusBadge status={s.status} /></td>
                  {canEdit && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => { setEditingId(s._id || s.id); setFormData({...s, subjectId: s.subject?._id || s.subjectId, examDate: s.examDate?.split('T')[0], marksPostingStartDate: s.marksPostingStartDate?.split('T')[0], marksPostingDeadline: s.marksPostingDeadline?.split('T')[0]}); setModalOpen(true); }}><FiEdit2 style={{ color: 'var(--warning)' }} /></button>
                        <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setDeleteConfirm(s._id || s.id)}><FiTrash2 style={{ color: 'var(--danger)' }} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Schedule" : "Create Schedule"}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
          <input id="schedule-exam-name-input" className="input" placeholder="Exam Name" value={formData.examName} onChange={e => setFormData({...formData, examName: e.target.value})} required />
          <select id="schedule-exam-type-select" className="input" value={formData.examType} onChange={e => setFormData({...formData, examType: e.target.value})} required>
            <option value="Mid-Term">Mid-Term</option><option value="Internal Assessment">Internal Assessment</option><option value="Practical">Practical</option><option value="End-Semester">End-Semester</option><option value="Supplementary">Supplementary</option>
          </select>
          <select id="schedule-branch-select" className="input" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} required>
            <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option>
          </select>
          <select id="schedule-semester-select" className="input" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} required>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s===1?'1st Semester':s===2?'2nd Semester':s===3?'3rd Semester':s+'th Semester'}>Semester {s}</option>)}
          </select>
          <select id="schedule-subject-select" className="input" value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} required style={{ gridColumn: '1 / -1' }}>
            <option value="">Select Subject</option>
            {subjectsOptions.map(sub => <option key={sub._id || sub.id} value={sub._id || sub.id}>{sub.subjectName} ({sub.subjectCode})</option>)}
          </select>
          <input id="schedule-exam-date-input" className="input" type="date" placeholder="Exam Date" value={formData.examDate} onChange={e => setFormData({...formData, examDate: e.target.value})} required />
          <div style={{ display: 'flex', gap: 10 }}>
            <input id="schedule-start-time-input" className="input" type="time" placeholder="Start Time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required />
            <input id="schedule-end-time-input" className="input" type="time" placeholder="End Time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required />
          </div>
          <input id="schedule-marks-start-input" className="input" type="date" placeholder="Marks Posting Start" value={formData.marksPostingStartDate} onChange={e => setFormData({...formData, marksPostingStartDate: e.target.value})} required />
          <input id="schedule-marks-deadline-input" className="input" type="date" placeholder="Marks Posting Deadline" value={formData.marksPostingDeadline} onChange={e => setFormData({...formData, marksPostingDeadline: e.target.value})} required />
          
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button id="save-schedule-btn" type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <FiSave /> Save Schedule
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Schedule" message="Are you sure you want to delete this schedule?" onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
}


