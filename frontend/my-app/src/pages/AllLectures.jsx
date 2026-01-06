import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';

const AllLectures = () => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const { data } = await api.get('/lectures');
      setLectures(data);
    } catch (error) {
      toast.error('Failed to fetch lectures');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lectureId) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await api.delete(`/lectures/${lectureId}`);
        toast.success('Lecture deleted successfully! ✓');
        fetchLectures();
      } catch (error) {
        toast.error('Failed to delete lecture');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const filterLectures = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'upcoming':
        return lectures.filter((lecture) => new Date(lecture.date) >= today);
      case 'past':
        return lectures.filter((lecture) => new Date(lecture.date) < today);
      default:
        return lectures;
    }
  };

  const filteredLectures = filterLectures();

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

      {/* Simple centered header */}
      <div className="mb-8 text-center">
        <h1
          className="text-3xl md:text-4xl font-bold mb-1"
          style={{ color: '#0369A1' }}
        >
          All Lectures
        </h1>
      </div>

      {/* Filter Pills */}
      <div
        className="mb-6 inline-flex gap-2 p-1 rounded-xl"
        style={{ backgroundColor: '#EFF6FF' }}
      >
        {['all', 'upcoming', 'past'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
              filter === filterOption ? 'shadow-md' : ''
            }`}
            style={
              filter === filterOption
                ? {
                    background:
                      'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                    color: '#FFFFFF',
                  }
                : { backgroundColor: 'transparent', color: '#64748B' }
            }
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </button>
        ))}
      </div>

      {/* Lectures Grid */}
      {filteredLectures.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {filteredLectures.map((lecture) => (
            <div
              key={lecture._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4"
              style={{
                borderLeftColor:
                  lecture.course?.level === 'Beginner'
                    ? '#10B981'
                    : lecture.course?.level === 'Intermediate'
                    ? '#F59E0B'
                    : '#EF4444',
              }}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Main Content */}
                  <div className="flex-1 space-y-4">
                    {/* Course & Level */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3
                        className="text-xl font-bold"
                        style={{ color: '#0369A1' }}
                      >
                        {lecture.course?.name}
                      </h3>
                      <span
                        className="px-3 py-1 rounded-lg text-xs font-bold"
                        style={{
                          backgroundColor: '#DBEAFE',
                          color: '#0369A1',
                        }}
                      >
                        {lecture.batchName}
                      </span>
                      <span
                        className="px-3 py-1 rounded-lg text-xs font-bold text-white"
                        style={{
                          backgroundColor:
                            lecture.course?.level === 'Beginner'
                              ? '#10B981'
                              : lecture.course?.level === 'Intermediate'
                              ? '#F59E0B'
                              : '#EF4444',
                        }}
                      >
                        {lecture.course?.level}
                      </span>
                    </div>

                    {/* Topic */}
                    <p
                      className="text-base font-semibold"
                      style={{ color: '#1E293B' }}
                    >
                      {lecture.topic}
                    </p>

                    {/* Instructor, Date & Time in Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ backgroundColor: '#F0F9FF' }}
                      >
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: '#0EA5E9' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-xs font-semibold truncate"
                            style={{ color: '#0369A1' }}
                          >
                            {lecture.instructor?.name}
                          </p>
                          <p
                            className="text-[10px] truncate"
                            style={{ color: '#64748B' }}
                          >
                            {lecture.instructor?.expertise}
                          </p>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ backgroundColor: '#F0F9FF' }}
                      >
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: '#0EA5E9' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p
                          className="text-xs font-semibold"
                          style={{ color: '#0369A1' }}
                        >
                          {formatDate(lecture.date)}
                        </p>
                      </div>

                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ backgroundColor: '#F0F9FF' }}
                      >
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: '#0EA5E9' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p
                          className="text-xs font-semibold"
                          style={{ color: '#0369A1' }}
                        >
                          {formatTime(lecture.startTime)} -{' '}
                          {formatTime(lecture.endTime)}
                        </p>
                      </div>
                    </div>

                    {/* Notes */}
                    {lecture.notes && (
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: '#F8FAFC' }}
                      >
                        <p
                          className="text-xs font-semibold mb-1"
                          style={{ color: '#64748B' }}
                        >
                          Notes:
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: '#475569' }}
                        >
                          {lecture.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(lecture._id)}
                    className="p-3 rounded-xl transition-all hover:shadow-md self-start"
                    style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#FECACA')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = '#FEE2E2')
                    }
                    title="Delete lecture"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl shadow-lg text-center py-20 px-6 border"
          style={{ borderColor: '#BFDBFE' }}
        >
          <div className="max-w-md mx-auto">
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: '#0369A1' }}
            >
              No Lectures Found
            </h3>
            <p
              className="text-base mb-6"
              style={{ color: '#64748B' }}
            >
              {filter === 'all'
                ? 'Start by assigning lectures to instructors'
                : `No ${filter} lectures available`}
            </p>
            <button
              onClick={() => navigate('/admin/lectures')}
              className="inline-block px-8 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all"
              style={{
                background:
                  'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'translateY(-2px)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'translateY(0)')
              }
            >
              + Assign Lecture
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllLectures;
