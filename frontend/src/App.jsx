import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import StudentProfilePage from './pages/StudentProfilePage';
import SubjectsPage from './pages/SubjectsPage';
import SchedulesPage from './pages/SchedulesPage';
import MarksPage from './pages/MarksPage';
import ResultsPage from './pages/ResultsPage';
import ResultHistoryPage from './pages/ResultHistoryPage';
import PerformancePage from './pages/PerformancePage';
import CredentialsPage from './pages/CredentialsPage';
import { ToastProvider } from './components/common/Toast';
import ServerWakingLoader from './components/common/ServerWakingLoader';
import { supabase } from './services/supabaseClient';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('edutrack_auth');
  return token ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('edutrack_user') || '{}');
  const role = user.role || '';
  if (role === 'ADMIN') return children;
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        localStorage.setItem('edutrack_auth', session.access_token);
        localStorage.setItem('edutrack_user', JSON.stringify({
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || 'Google User',
          role: 'ADMIN' // Defaulting to ADMIN for demo purposes
        }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        localStorage.setItem('edutrack_auth', session.access_token);
        localStorage.setItem('edutrack_user', JSON.stringify({
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || 'Google User',
          role: 'ADMIN'
        }));
      } else {
        localStorage.removeItem('edutrack_auth');
        localStorage.removeItem('edutrack_user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ServerWakingLoader>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              
              <Route path="/students" element={<RoleRoute allowedRoles={['CREDENTIAL_MANAGER', 'TEACHER']}><StudentsPage /></RoleRoute>} />
              <Route path="/students/:id" element={<RoleRoute allowedRoles={['CREDENTIAL_MANAGER', 'TEACHER']}><StudentProfilePage /></RoleRoute>} />
              
              <Route path="/subjects" element={<RoleRoute allowedRoles={['TEACHER', 'STUDENT']}><SubjectsPage /></RoleRoute>} />
              <Route path="/schedules" element={<RoleRoute allowedRoles={['TEACHER', 'STUDENT']}><SchedulesPage /></RoleRoute>} />
              
              <Route path="/marks" element={<RoleRoute allowedRoles={['TEACHER']}><MarksPage /></RoleRoute>} />
              
              <Route path="/results" element={<RoleRoute allowedRoles={['TEACHER', 'STUDENT']}><ResultsPage /></RoleRoute>} />
              <Route path="/results/history" element={<RoleRoute allowedRoles={['TEACHER', 'STUDENT']}><ResultHistoryPage /></RoleRoute>} />
              <Route path="/performance" element={<RoleRoute allowedRoles={['TEACHER', 'STUDENT']}><PerformancePage /></RoleRoute>} />
              
              <Route path="/credentials" element={<RoleRoute allowedRoles={['CREDENTIAL_MANAGER']}><CredentialsPage /></RoleRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ServerWakingLoader>
  );
}

export default App;
