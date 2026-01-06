import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalInstructors: 0,
    upcomingLectures: 0,
    totalLectures: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, instructorsRes, lecturesRes] = await Promise.all([
        api.get('/courses'),
        api.get('/instructors'),
        api.get('/lectures'),
      ]);

      const courses = coursesRes.data;
      const lectures = lecturesRes.data;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setStats({
        totalCourses: courses.length,
        totalInstructors: instructorsRes.data.length,
        totalLectures: lectures.length,
        upcomingLectures: lectures.filter(
          (lecture) => new Date(lecture.date) >= today
        ).length,
      });

      setRecentCourses(courses.slice(0, 3));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg font-semibold" style={{ color: '#0369A1' }}>
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const statsCards = [
    { label: 'Total Courses', value: stats.totalCourses, gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)', path: '/admin/courses' },
    { label: 'Total Instructors', value: stats.totalInstructors, gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', path: '/admin/instructors' },
    { label: 'Upcoming Lectures', value: stats.upcomingLectures, gradient: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)', path: '/admin/all-lectures' },
    { label: 'Total Lectures', value: stats.totalLectures, gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', path: '/admin/all-lectures' },
  ];

  return (
    <DashboardLayout>
      <ToastContainer />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <Link 
            key={index}
            to={stat.path}
            className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            style={{ background: stat.gradient }}
          >
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-2">
              {stat.label}
            </h3>
            <p className="text-4xl font-bold text-white">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Courses */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border" style={{ borderColor: '#BFDBFE' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#0369A1' }}>
            Recent Courses
          </h2>
        </div>

        {recentCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCourses.map((course) => (
              <Link
                key={course._id}
                to={`/admin/courses/${course._id}`}
                className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border"
                style={{ borderColor: '#BFDBFE' }}
              >
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                    style={{ backgroundColor: '#DBEAFE', color: '#0369A1' }}>
                    {course.level}
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#0369A1' }}>
                    {course.name}
                  </h3>
                  <p className="text-sm line-clamp-2" style={{ color: '#64748B' }}>
                    {course.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-semibold mb-2" style={{ color: '#64748B' }}>
              No courses found
            </p>
            <Link
              to="/admin/courses/add"
              className="inline-block px-6 py-3 rounded-lg font-bold text-white transition-all hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)' }}
            >
              Add First Course
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
