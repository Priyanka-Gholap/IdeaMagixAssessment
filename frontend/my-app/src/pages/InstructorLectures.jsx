import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';

const InstructorLectures = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

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

  const isUpcoming = (date) => {
    return new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0));
  };

  const filteredLectures = lectures.filter((lecture) => {
    if (filter === 'upcoming') return isUpcoming(lecture.date);
    if (filter === 'completed') return !isUpcoming(lecture.date);
    return true;
  });

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

      {/* Page Header - Simple Centered Text */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold" style={{ color: '#0369A1' }}>
          My Lectures
        </h1>
      </div>

      {/* Filter Pills */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex gap-2 p-1 rounded-xl" style={{ backgroundColor: '#EFF6FF' }}>
          {['upcoming', 'completed', 'all'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                filter === filterOption ? 'shadow-md' : ''
              }`}
              style={
                filter === filterOption
                  ? { background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)', color: '#FFFFFF' }
                  : { backgroundColor: 'transparent', color: '#64748B' }
              }
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Lectures Grid */}
      {filteredLectures.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {filteredLectures.map((lecture) => (
            <div
              key={lecture._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4"
              style={{ borderLeftColor: isUpcoming(lecture.date) ? '#10B981' : '#94A3B8' }}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Main Content */}
                  <div className="flex-1 space-y-4">
                    {/* Course Header */}
                    <div className="flex items-center gap-4">
                      {lecture.course?.image && (
                        <img
                          src={lecture.course.image}
                          alt={lecture.course.name}
                          className="w-16 h-16 object-cover rounded-xl shadow-md ring-2 ring-white"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1" style={{ color: '#0369A1' }}>
                          {lecture.course?.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-3 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: '#DBEAFE', color: '#0369A1' }}>
                            {lecture.batchName}
                          </span>
                          <span className="px-3 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: '#F0F9FF', color: '#64748B' }}>
                            {lecture.course?.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: '#F0F9FF' }}>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#64748B' }}>Date</p>
                        <p className="text-sm font-semibold" style={{ color: '#0369A1' }}>{formatDate(lecture.date)}</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: '#F0F9FF' }}>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#64748B' }}>Time</p>
                        <p className="text-sm font-semibold" style={{ color: '#0369A1' }}>
                          {formatTime(lecture.startTime)} - {formatTime(lecture.endTime)}
                        </p>
                      </div>
                    </div>

                    {/* Topic */}
                    {lecture.topic && (
                      <div className="p-3 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#64748B' }}>Topic</p>
                        <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>{lecture.topic}</p>
                      </div>
                    )}

                    {/* Notes */}
                    {lecture.notes && (
                      <div className="p-3 rounded-lg border-l-2" style={{ backgroundColor: '#DBEAFE', borderLeftColor: '#0EA5E9' }}>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#0369A1' }}>Notes</p>
                        <p className="text-sm" style={{ color: '#475569' }}>{lecture.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="self-start">
                    <span
                      className="inline-block px-4 py-2 rounded-xl text-sm font-bold"
                      style={{
                        backgroundColor: isUpcoming(lecture.date) ? '#D1FAE5' : '#F1F5F9',
                        color: isUpcoming(lecture.date) ? '#065F46' : '#64748B',
                      }}
                    >
                      {isUpcoming(lecture.date) ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg text-center py-20 px-6 border" style={{ borderColor: '#BFDBFE' }}>
          <div className="max-w-md mx-auto">
            <p className="text-2xl font-bold mb-2" style={{ color: '#0369A1' }}>No lectures found</p>
            <p className="text-base" style={{ color: '#64748B' }}>
              {filter === 'upcoming' && 'No upcoming lectures scheduled'}
              {filter === 'completed' && 'No completed lectures yet'}
              {filter === 'all' && 'No lectures assigned'}
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default InstructorLectures;
