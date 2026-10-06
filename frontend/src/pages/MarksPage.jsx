import React, { useState, useEffect } from 'react';
import { useToast } from '../components/common/Toast';
import { getStudents } from '../services/studentService';
import { getSubjects } from '../services/subjectService';
import { getSchedules } from '../services/scheduleService';
import { getMarksBySchedule, saveMarks, submitMarks } from '../services/marksService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import { FiEdit3, FiSave, FiCheckCircle, FiCalendar, FiFilter, FiCheck } from 'react-icons/fi';

export default function MarksPage() {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [scheduleId, setScheduleId] = useState('');
  
  const [subjects, setSubjects] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [currentSchedule, setCurrentSchedule] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (branch && semester) {
      getSubjects({ branch, semester }).then(res => setSubjects(res.data)).catch(() => {});
    } else {
      setSubjects([]); setSubjectId('');
    }
  }, [branch, semester]);

  useEffect(() => {
    if (subjectId) {
      getSchedules({ branch, semester }).then(res => {
        setSchedules(res.data.filter(s => (s.subject?._id || s.subjectId) === subjectId));
      }).catch(() => {});
    } else {
      setSchedules([]); setScheduleId('');
    }
  }, [subjectId, branch, semester]);

  useEffect(() => {
    if (scheduleId) {
      const sched = schedules.find(s => (s._id || s.id) === scheduleId);
      setCurrentSchedule(sched);
      fetchMarksData(sched);
    } else {
      setCurrentSchedule(null);
      setStudents([]);
    }
  }, [scheduleId]);

  const fetchMarksData = async (sched) => {
    setLoading(true);
    try {
      const studsRes = await getStudents({ branch, semester });
      const marksRes = await getMarksBySchedule(sched._id || sched.id);
      
      const marksMap = {};
      marksRes.data.forEach(m => {
        marksMap[m.student?._id || m.studentId] = m.marksObtained;
      });
      
      setStudents(studsRes.data);
      setMarks(marksMap);
    } catch (err) {
      showToast('Error loading marks data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRow = async (studentId) => {
    if (!marks[studentId] && marks[studentId] !== 0) return showToast('Please enter marks first', 'warning');
    try {
      await saveMarks({ scheduleId, studentId, marksObtained: Number(marks[studentId]) });
      showToast('Marks saved successfully', 'success');
    } catch (e) {
      showToast('Failed to save marks', 'error');
    }
  };

  const handleSubmitAll = async () => {
    try {
      await submitMarks(scheduleId);
      showToast('All marks submitted successfully', 'success');
      fetchMarksData(currentSchedule);
    } catch (e) {
      showToast('Failed to submit all marks', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2><FiEdit3 style={{ color: 'var(--primary)', marginRight: 8 }} /> Marks Posting &amp; Management</h2>
      </div>

      <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 15, flexWrap: 'wrap', alignItems: 'center' }}>
        <select id="marks-branch-select" className="input" style={{ width: 160 }} value={branch} onChange={e => setBranch(e.target.value)}>
          <option value="">Select Branch</option>
          <option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option><option value="EEE">EEE</option><option value="ME">ME</option>
        </select>
        <select id="marks-semester-select" className="input" style={{ width: 160 }} value={semester} onChange={e => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s===1?'1st Semester':s===2?'2nd Semester':s===3?'3rd Semester':s+'th Semester'}>Semester {s}</option>)}
        </select>
        <select className="input" style={{ width: 220 }} value={subjectId} onChange={e => setSubjectId(e.target.value)} disabled={!subjects.length}>
          <option value="">Select Subject</option>
          {subjects.map(s => <option key={s._id||s.id} value={s._id||s.id}>{s.subjectName}</option>)}
        </select>
        <select className="input" style={{ width: 220 }} value={scheduleId} onChange={e => setScheduleId(e.target.value)} disabled={!schedules.length}>
          <option value="">Select Exam Schedule</option>
          {schedules.map(s => <option key={s._id||s.id} value={s._id||s.id}>{s.examName}</option>)}
        </select>
      </div>

      {currentSchedule && (
        <div className="card" style={{ marginBottom: 20, background: 'var(--surface-hover)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{currentSchedule.examName}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Exam Date: {currentSchedule.examDate?.split('T')[0]} | Deadline: {currentSchedule.marksPostingDeadline?.split('T')[0]}</p>
            </div>
            <StatusBadge status={currentSchedule.status} />
          </div>
        </div>
      )}
      
      {currentSchedule && students.length > 0 && (
        <div className="card table-container">
          {loading ? <LoadingSpinner /> : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Max Marks</th>
                    <th>Marks Obtained</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(st => {
                    const sId = st._id || st.id;
                    return (
                      <tr key={sId}>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{st.studentId}</td>
                        <td style={{ fontWeight: 600 }}>{st.fullName}</td>
                        <td>100</td>
                        <td>
                          <input type="number" min="0" max="100" className="input" style={{ width: 100 }} value={marks[sId] ?? ''} onChange={e => setMarks({...marks, [sId]: e.target.value})} disabled={currentSchedule.status === 'Completed'} />
                        </td>
                        <td>
                          <button className="btn btn-secondary" style={{ padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => handleSaveRow(sId)} disabled={currentSchedule.status === 'Completed'}>
                            <FiSave /> Save
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }} onClick={handleSubmitAll} disabled={currentSchedule.status === 'Completed'}>
                  <FiCheckCircle /> Submit All Marks
                </button>
              </div>
            </>
          )}
        </div>
      )}
      
      {currentSchedule && students.length === 0 && !loading && (
        <EmptyState title="No active students found" subtitle="No active students registered for this branch and semester." />
      )}
    </div>
  );
}


