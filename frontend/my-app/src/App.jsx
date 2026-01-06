import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loader from './components/Loader';

// Pages
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import InstructorLectures from './pages/InstructorLectures';
import InstructorProfile from './pages/InstructorProfile';
import InstructorList from './pages/InstructorList';
import CourseList from './pages/CourseList';
import AddCourse from './pages/AddCourse';
import CourseDetail from './pages/CourseDetail';
import AddLecture from './pages/AddLecture';
import AssignLecture from './pages/AssignLecture';
import AllLectures from './pages/AllLectures';

/* 🔐 Simple Role Guard (NO ProtectedRoute file needed) */
const RequireAuth = ({ user, role, children }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/* 🏠 Home Redirect */
const HomeRedirect = ({ user }) => {
  if (!user) return <AuthPage />;

  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === 'instructor') {
    return <Navigate to="/instructor" replace />;
  }

  return <AuthPage />;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<HomeRedirect user={user} />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <RequireAuth user={user} role="admin">
              <AdminDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <RequireAuth user={user} role="admin">
              <CourseList />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/courses/add"
          element={
            <RequireAuth user={user} role="admin">
              <AddCourse />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/courses/:id"
          element={
            <RequireAuth user={user} role="admin">
              <CourseDetail />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/courses/:id/add-lecture"
          element={
            <RequireAuth user={user} role="admin">
              <AddLecture />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/instructors"
          element={
            <RequireAuth user={user} role="admin">
              <InstructorList />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/lectures"
          element={
            <RequireAuth user={user} role="admin">
              <AssignLecture />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/all-lectures"
          element={
            <RequireAuth user={user} role="admin">
              <AllLectures />
            </RequireAuth>
          }
        />

        {/* ================= INSTRUCTOR ROUTES ================= */}
        <Route
          path="/instructor"
          element={
            <RequireAuth user={user} role="instructor">
              <InstructorDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/instructor/lectures"
          element={
            <RequireAuth user={user} role="instructor">
              <InstructorLectures />
            </RequireAuth>
          }
        />

        <Route
          path="/instructor/profile"
          element={
            <RequireAuth user={user} role="instructor">
              <InstructorProfile />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;