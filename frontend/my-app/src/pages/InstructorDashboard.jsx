import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const { data } = await api.get(`/lectures/instructor/${user._id}`);
      setLectures(data);
    } catch (error) {
      toast.error('Failed to fetch lectures');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isUpcoming = (date) => {
    return new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0));
  };

  const upcomingLectures = lectures.filter((lecture) => isUpcoming(lecture.date));

  // Simple loading text
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg font-semibold" style={{ color: '#0369A1' }}>
            Loading lectures...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* Welcome Header - Simple Centered Text */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold" style={{ color: '#0369A1' }}>
          Welcome back, {user?.name}!
        </h1>
      </div>

      {/* Upcoming Lectures Section */}
      <div
        className="rounded-2xl border shadow-lg overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#BFDBFE' }}
      >
        <div
          className="p-6 border-b text-center"
          style={{
            background: 'linear-gradient(to right, #EFF6FF, #F0F9FF)',
            borderColor: '#BFDBFE',
          }}
        >
          <h2 className="text-2xl font-bold" style={{ color: '#0369A1' }}>
            Upcoming Lectures
          </h2>
        </div>

        <div className="p-6">
          {upcomingLectures.length > 0 ? (
            <div className="space-y-5">
              {upcomingLectures.map((lecture) => (
                <div
                  key={lecture._id}
                  className="rounded-xl p-5 border-l-4 hover:shadow-xl transition-all duration-300"
                  style={{
                    backgroundColor: '#F0F9FF',
                    borderLeftColor: '#0EA5E9',
                    border: '1px solid #BFDBFE',
                  }}
                >
                  {/* Course Header */}
                  <div className="flex items-center gap-4 mb-4">
                    {lecture.course?.image && (
                      <img
                        src={lecture.course.image}
                        alt={lecture.course.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-md ring-2 ring-white"
                      />
                    )}
                    <div className="flex-1">
                      <h3
                        className="text-xl font-bold mb-1"
                        style={{ color: '#0369A1' }}
                      >
                        {lecture.course?.name}
                      </h3>
                      <span
                        className="inline-block px-3 py-1 rounded-lg text-xs font-bold"
                        style={{
                          backgroundColor: '#DBEAFE',
                          color: '#0369A1',
                        }}
                      >
                        {lecture.batchName}
                      </span>
                    </div>
                  </div>

                  {/* Date & Time Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                      <p
                        className="text-xs font-bold uppercase tracking-wide mb-1"
                        style={{ color: '#64748B' }}
                      >
                        Date
                      </p>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: '#0369A1' }}
                      >
                        {formatDate(lecture.date)}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                      <p
                        className="text-xs font-bold uppercase tracking-wide mb-1"
                        style={{ color: '#64748B' }}
                      >
                        Time
                      </p>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: '#0369A1' }}
                      >
                        {lecture.startTime} - {lecture.endTime}
                      </span>
                    </div>
                  </div>

                  {/* Topic */}
                  {lecture.topic && (
                    <div className="mb-3 p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                      <p
                        className="text-xs font-bold uppercase tracking-wide mb-1"
                        style={{ color: '#64748B' }}
                      >
                        Topic
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: '#0F172A' }}
                      >
                        {lecture.topic}
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {lecture.notes && (
                    <div
                      className="p-4 rounded-lg border-l-2"
                      style={{
                        backgroundColor: '#DBEAFE',
                        borderLeftColor: '#0EA5E9',
                      }}
                    >
                      <p
                        className="text-xs font-bold uppercase tracking-wide mb-1"
                        style={{ color: '#0369A1' }}
                      >
                        Notes
                      </p>
                      <p className="text-sm" style={{ color: '#475569' }}>
                        {lecture.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg font-bold mb-2" style={{ color: '#0369A1' }}>
                No upcoming lectures scheduled
              </p>
              <p className="text-sm" style={{ color: '#94A3B8' }}>
                Check back soon for new assignments
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorDashboard;
