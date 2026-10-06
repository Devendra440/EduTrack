import React, { useState, useEffect } from 'react';
import { getAllResults } from '../services/resultService';
import { useToast } from '../components/common/Toast';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function ResultHistoryPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getAllResults().then(res => setResults(res.data)).catch(() => showToast('Error loading results', 'error')).finally(() => setLoading(false));
  }, []);

  const filteredResults = results.filter(r => {
    const sid = r.student?.studentId?.toLowerCase() || '';
    const matchSearch = sid.includes(search.toLowerCase());
    const matchBranch = branchFilter ? r.student?.branch === branchFilter : true;
    const matchSem = semesterFilter ? String(r.semester) === semesterFilter : true;
    const matchStatus = statusFilter ? r.status === statusFilter : true;
    return matchSearch && matchBranch && matchSem && matchStatus;
  });

  return (
    <div>
      <h2>Result History</h2>
      
      <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 15, flexWrap: 'wrap' }}>
        <input className="input" placeholder="Search by Student ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
        <select className="input" style={{ width: 150 }} value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
          <option value="">All Branches</option>
          <option value="CSE">CSE</option><option value="IT">IT</option>
        </select>
        <select className="input" style={{ width: 150 }} value={semesterFilter} onChange={e => setSemesterFilter(e.target.value)}>
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s===1?'1st Semester':s===2?'2nd Semester':s===3?'3rd Semester':s+'th Semester'}>Semester {s}</option>)}
        </select>
        <select className="input" style={{ width: 150 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="PASS">PASS</option><option value="FAIL">FAIL</option>
        </select>
      </div>

      <div className="card table-container">
        {loading ? <LoadingSpinner /> : filteredResults.length === 0 ? <EmptyState title="No results found" /> : (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Academic Year</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r, idx) => (
                <tr key={r._id || r.id} onClick={() => navigate(`/results?studentId=${r.student?.studentId}`)} style={{ cursor: 'pointer' }} className="hover-row">
                  <td>{idx + 1}</td>
                  <td>{r.student?.studentId || 'N/A'}</td>
                  <td>{r.student?.fullName || 'N/A'}</td>
                  <td>{r.student?.branch || 'N/A'}</td>
                  <td>{r.semester}</td>
                  <td>{r.academicYear}</td>
                  <td>{r.percentage}%</td>
                  <td><StatusBadge status={r.grade} /></td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>{r.createdAt ? r.createdAt.split('T')[0] : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


