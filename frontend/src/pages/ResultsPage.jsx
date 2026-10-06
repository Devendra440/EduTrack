import React, { useState } from 'react';
import { useToast } from '../components/common/Toast';
import { getResultsByStudent, calculateResult } from '../services/resultService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiSearch, FiPrinter, FiRefreshCw, FiAward, FiFileText, FiUser, FiCheckCircle } from 'react-icons/fi';

export default function ResultsPage() {
  const [studentId, setStudentId] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!studentId) return;
    setLoading(true);
    try {
      const res = await getResultsByStudent(studentId.trim());
      setResults(res.data);
      if (!res.data || res.data.length === 0) showToast('No results found for this student ID', 'warning');
    } catch (err) {
      showToast('Error searching results', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    if (!studentId) return;
    try {
      await calculateResult({ studentId: studentId.trim(), semester: 5, academicYear: '2024-25' });
      showToast('Result calculated successfully!', 'success');
      handleSearch({ preventDefault: () => {} });
    } catch (err) {
      showToast('Error calculating result', 'error');
    }
  };

  return (
    <div>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2><FiFileText style={{ color: 'var(--primary)', marginRight: 8 }} /> Student Academic Results</h2>
      </div>

      <div className="card no-print" style={{ marginBottom: 24, padding: 24 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
            <input
              id="result-student-id-input"
              className="input"
              placeholder="Enter Student ID (e.g., ST101)"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              required
              style={{ paddingLeft: 38 }}
            />
          </div>
          <button id="result-search-btn" type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiSearch /> Search Result Card
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && results.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 20 }} className="no-print">
          <button className="btn btn-secondary" onClick={handleCalculate} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiRefreshCw /> Recalculate Grade Card
          </button>
          <button className="btn btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiPrinter /> Print Official Grade Sheet
          </button>
        </div>
      )}

      {!loading && results.map((result, idx) => (
        <div key={result._id || idx} className="card result-card" style={{ marginBottom: 30, padding: 40, background: '#fff', border: '1px solid var(--border)', borderRadius: 12 }}>
          
          {/* Header with Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28, borderBottom: '2px solid var(--primary)', paddingBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="EduTrack Logo" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />
            <div>
              <h1 style={{ margin: 0, color: 'var(--primary)', letterSpacing: 1.5, fontSize: 26, fontWeight: 800 }}>EDUTRACK ACADEMIC PORTAL</h1>
              <h3 style={{ margin: '6px 0 0 0', textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: 14, letterSpacing: 1 }}>Official Student Grade Card</h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24, padding: 18, background: 'var(--surface-hover)', borderRadius: 8, fontSize: 14.5 }}>
            <div><strong>Student Name:</strong> {result.studentName || result.student?.fullName || 'Rahul Kumar'}</div>
            <div><strong>Student ID:</strong> {result.studentId || studentId}</div>
            <div><strong>Branch:</strong> {result.branch || 'CSE'}</div>
            <div><strong>Semester:</strong> {result.semester || '5th Semester'}</div>
            <div><strong>Academic Year:</strong> {result.academicYear || '2024-25'}</div>
            <div><strong>Published Date:</strong> {result.publishedAt ? new Date(result.publishedAt).toLocaleDateString() : 'Recent'}</div>
          </div>

          <table style={{ width: '100%', marginBottom: 24, borderCollapse: 'collapse', border: '1px solid var(--border)' }}>
            <thead style={{ background: 'var(--surface-hover)' }}>
              <tr>
                <th style={{ border: '1px solid var(--border)', padding: 12, textAlign: 'left' }}>Subject Code &amp; Name</th>
                <th style={{ border: '1px solid var(--border)', padding: 12, textAlign: 'center' }}>Marks Obtained</th>
                <th style={{ border: '1px solid var(--border)', padding: 12, textAlign: 'center' }}>Max Marks</th>
                <th style={{ border: '1px solid var(--border)', padding: 12, textAlign: 'center' }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {result.subjectResults && result.subjectResults.length > 0 ? (
                result.subjectResults.map((sub, i) => (
                  <tr key={i}>
                    <td style={{ border: '1px solid var(--border)', padding: 12 }}><strong>{sub.subjectCode}</strong> — {sub.subjectName}</td>
                    <td style={{ border: '1px solid var(--border)', padding: 12, textAlign: 'center', fontWeight: 600 }}>{sub.marks}</td>
                    <td style={{ border: '1px solid var(--border)', padding: 12, textAlign: 'center' }}>{sub.maxMarks || 100}</td>
                    <td style={{ border: '1px solid var(--border)', padding: 12, textAlign: 'center' }}><StatusBadge status={sub.grade} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={{ border: '1px solid var(--border)', padding: 12 }}>Core Academic Subjects</td>
                  <td style={{ border: '1px solid var(--border)', padding: 12, textAlign: 'center', fontWeight: 600 }}>{Math.round(result.percentage || 85)}</td>
                  <td style={{ border: '1px solid var(--border)', padding: 12, textAlign: 'center' }}>100</td>
                  <td style={{ border: '1px solid var(--border)', padding: 12, textAlign: 'center' }}><StatusBadge status={result.grade || 'A'} /></td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ border: '1.5px solid var(--primary)', padding: 18, borderRadius: 8, display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: 'rgba(37, 99, 235, 0.04)' }}>
            <div><span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Overall Percentage:</span> <strong style={{ fontSize: 18, color: 'var(--primary)' }}>{result.percentage?.toFixed(1)}%</strong></div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Grade Assigned:</span> <StatusBadge status={result.grade || 'A'} /></div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Final Status:</span> <StatusBadge status={result.status || 'PASS'} /></div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }} className="no-print">
            <button className="btn btn-primary" onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <FiPrinter /> Print Official Grade Sheet
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}


