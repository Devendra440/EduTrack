import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentById } from '../services/studentService';
import { getResultsByStudent } from '../services/resultService';
import { useToast } from '../components/common/Toast';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await getStudentById(id);
        setStudent(studentRes.data);
        if (studentRes.data?.studentId) {
          const resultsRes = await getResultsByStudent(studentRes.data.studentId);
          setResults(resultsRes.data);
        }
      } catch (err) {
        showToast('Error loading profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!student) return <EmptyState title="Student not found" />;

  return (
    <div>
      <button className="btn btn-secondary" onClick={() => navigate('/students')} style={{ marginBottom: 20 }}>&larr; Back to Students</button>
      
      <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
          {student.fullName?.charAt(0)}
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{student.fullName}</h2>
          <p style={{ margin: '5px 0', color: 'var(--text-secondary)' }}>ID: {student.studentId} | <StatusBadge status={student.status} /></p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Details</h3>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Branch:</strong> {student.branch}</p>
        <p><strong>Semester:</strong> {student.semester}</p>
        <p><strong>Academic Year:</strong> {student.academicYear}</p>
      </div>

      <div className="card">
        <h3>Academic Performance</h3>
        {results.length === 0 ? <EmptyState title="No results published yet" /> : (
          <table style={{ width: '100%', marginTop: 10 }}>
            <thead>
              <tr>
                <th>Semester</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r._id || r.id}>
                  <td>{r.semester}</td>
                  <td>{r.percentage}%</td>
                  <td><StatusBadge status={r.grade} /></td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


