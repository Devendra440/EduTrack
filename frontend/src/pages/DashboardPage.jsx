import React, { useEffect, useState } from 'react';
import {
  getDashboardStats, getBranchDistribution, getResultPerformance,
  getUpcomingExams, getMarksPostingStatus, getRecentActivity,
  getDashboardTopPerformers
} from '../services/dashboardService';
import StatsCard from '../components/common/StatsCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../components/common/Toast';
import {
  FiUsers, FiBook, FiCalendar, FiFileText,
  FiAward, FiBarChart2, FiCheckCircle, FiAlertCircle, FiTrendingUp
} from 'react-icons/fi';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#1e40af', '#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function DashboardPage() {
  const [stats, setStats]           = useState(null);
  const [branchDist, setBranchDist] = useState([]);
  const [resultPerf, setResultPerf] = useState([]);
  const [upcoming, setUpcoming]     = useState([]);
  const [marksStatus, setMarksStatus] = useState([]);
  const [activity, setActivity]     = useState([]);
  const [topPerf, setTopPerf]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          statsRes, branchRes, perfRes,
          upcomingRes, marksRes, activityRes, topRes
        ] = await Promise.allSettled([
          getDashboardStats(),
          getBranchDistribution(),
          getResultPerformance(),
          getUpcomingExams(),
          getMarksPostingStatus(),
          getRecentActivity(),
          getDashboardTopPerformers(),
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
        if (branchRes.status === 'fulfilled') {
          const d = branchRes.value.data;
          setBranchDist(Object.entries(d).map(([name, value]) => ({ name, value })));
        }
        if (perfRes.status === 'fulfilled') {
          const d = perfRes.value.data;
          setResultPerf([
            { name: 'Passed', value: d.passed || 0, fill: '#16a34a' },
            { name: 'Failed', value: d.failed || 0, fill: '#dc2626' },
          ]);
        }
        if (upcomingRes.status === 'fulfilled')  setUpcoming(upcomingRes.value.data?.slice(0, 5) || []);
        if (marksRes.status === 'fulfilled')     setMarksStatus(marksRes.value.data?.slice(0, 5) || []);
        if (activityRes.status === 'fulfilled')  setActivity(activityRes.value.data || []);
        if (topRes.status === 'fulfilled')       setTopPerf(topRes.value.data?.slice(0, 5) || []);
      } catch {
        showToast('Error loading dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner />;

  const s = stats || {};

  return (
    <div>
      {/* Header */}
      <div className="dashboard-greeting">
        <h1>{getGreeting()}, Admin 👋</h1>
        <p>Here's your academic overview for today.</p>
      </div>

      {/* Stats Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(155px,1fr))', marginBottom: 24 }}>
        <StatsCard title="Total Students"    value={s.totalStudents ?? 0}       icon={<FiUsers />}    color="primary" />
        <StatsCard title="Total Subjects"    value={s.totalSubjects ?? 0}       icon={<FiBook />}     color="info" />
        <StatsCard title="Upcoming Exams"    value={s.upcomingExams ?? 0}        icon={<FiCalendar />} color="warning" />
        <StatsCard title="Pending Marks"     value={s.pendingMarks ?? 0}         icon={<FiFileText />} color="danger" />
        <StatsCard title="Pass Rate"         value={`${s.passRate ?? 0}%`}       icon={<FiBarChart2 />} color="success" />
        <StatsCard title="Published Results" value={s.publishedResults ?? 0}     icon={<FiAward />}    color="purple" />
      </div>

      {/* Charts Row */}
      <div className="charts-grid" style={{ marginBottom: 24 }}>
        {/* Branch Distribution */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Branch Distribution</span>
          </div>
          {branchDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={branchDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={true}
                >
                  {branchDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No data available
            </div>
          )}
        </div>

        {/* Result Performance */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Result Performance</span>
          </div>
          {resultPerf.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={resultPerf} barSize={48}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {resultPerf.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No results published yet
            </div>
          )}
        </div>
      </div>

      {/* Info Grid Row */}
      <div className="info-grid" style={{ marginBottom: 24 }}>
        {/* Upcoming Exams */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📅 Upcoming Exams</span>
          </div>
          {upcoming.length > 0 ? upcoming.map((s, i) => (
            <div key={i} className="exam-item">
              <div>
                <div className="exam-subject">{s.subjectName || s.examName}</div>
                <div className="exam-branch">{s.branch} • {s.semester}</div>
                <div style={{ marginTop: 4 }}><StatusBadge status={s.status} /></div>
              </div>
              <div className="exam-date">
                <div style={{ fontWeight: 500 }}>{s.examDate}</div>
                <div style={{ marginTop: 2, color: 'var(--text-muted)' }}>{s.startTime}</div>
              </div>
            </div>
          )) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              No upcoming exams
            </p>
          )}
        </div>

        {/* Marks Posting Status */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📝 Marks Posting</span>
          </div>
          {marksStatus.length > 0 ? marksStatus.map((m, i) => (
            <div key={i} className="marks-item">
              <div>
                <div className="exam-subject">{m.subjectName || m.examName}</div>
                <div className="exam-branch">Deadline: {m.marksPostingDeadline}</div>
              </div>
              <StatusBadge status={m.status} />
            </div>
          )) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              No pending marks
            </p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🕐 Recent Activity</span>
          </div>
          {activity.length > 0 ? activity.map((a, i) => (
            <div key={i} className="activity-item">
              <div className="activity-dot" />
              <span>{a}</span>
            </div>
          )) : (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              No recent activity
            </p>
          )}
        </div>
      </div>

      {/* Top Performers */}
      {topPerf.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">🏆 Top Performers</span>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Branch</th>
                  <th>Semester</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {topPerf.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <span className={`rank-badge rank-${i < 3 ? i + 1 : 'other'}`}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{r.studentName}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{r.studentId}</td>
                    <td>{r.branch}</td>
                    <td>{r.semester}</td>
                    <td style={{ fontWeight: 600, color: 'var(--success)' }}>{r.percentage?.toFixed(1)}%</td>
                    <td><StatusBadge status={r.grade} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


