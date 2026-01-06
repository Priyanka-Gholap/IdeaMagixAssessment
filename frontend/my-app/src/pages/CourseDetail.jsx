import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data.course);
      setLectures(data.lectures);
    } catch (error) {
      toast.error('Failed to fetch course details');
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await api.delete(`/lectures/${lectureId}`);
        toast.success('Lecture deleted successfully! ✓');
        fetchCourseDetails();
      } catch (error) {
        toast.error('Failed to delete lecture');
      }
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

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return { bg: '#DBEAFE', text: '#0369A1', border: '#60A5FA' };
      case 'Intermediate':
        return { bg: '#FEF3C7', text: '#92400E', border: '#FBBF24' };
      case 'Advanced':
        return { bg: '#FEE2E2', text: '#991B1B', border: '#F87171' };
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#94A3B8' };
    }
  };

  // Simple loading text
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg font-semibold" style={{ color: '#0369A1' }}>
            Loading course details...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) return null;

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* Simple centered header */}
      <div className="mb-8 text-center">
        <h1
          className="text-3xl md:text-4xl font-bold mb-1"
          style={{ color: '#0369A1' }}
        >
          {course.name}
        </h1>
        <p className="text-sm md:text-base" style={{ color: '#64748B' }}>
          {course.level} • {lectures.length} {lectures.length !== 1 ? 'lectures' : 'lecture'}
        </p>
      </div>

      {/* Course Info Card */}
      <div
        className="rounded-2xl shadow-lg mb-8 overflow-hidden border"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#BFDBFE' }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Course Image */}
          {course.image && (
            <div className="md:w-80 h-64 md:h-auto flex-shrink-0">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Course Info */}
          <div className="flex-1 p-6 md:p-8">
            {/* Level Badge */}
            <span
              className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold mb-4 border"
              style={{
                backgroundColor: getLevelColor(course.level).bg,
                color: getLevelColor(course.level).text,
                borderColor: getLevelColor(course.level).border,
              }}
            >
              {course.level}
            </span>

            {/* Description */}
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: '#64748B' }}
            >
              {course.description}
            </p>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm">
              <p style={{ color: '#64748B' }}>
                <span className="font-semibold" style={{ color: '#0369A1' }}>
                  Created by:
                </span>{' '}
                {course.createdBy?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lectures Section */}
      <div
        className="rounded-2xl shadow-lg overflow-hidden border"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#BFDBFE' }}
      >
        {/* Header */}
        <div
          className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{
            background: 'linear-gradient(to right, #EFF6FF, #F0F9FF)',
            borderColor: '#BFDBFE',
          }}
        >
          <h2 className="text-2xl font-bold" style={{ color: '#0369A1' }}>
            Course Lectures
          </h2>
          <Link
            to={`/admin/courses/${id}/add-lecture`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all shadow-md hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'translateY(-2px)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = 'translateY(0)')
            }
          >
            Add Lecture
          </Link>
        </div>

        {/* Content */}
        <div className="p-6">
          {lectures.length > 0 ? (
            <div className="space-y-4">
              {lectures.map((lecture) => (
                <div
                  key={lecture._id}
                  className="border-2 rounded-xl p-5 hover:shadow-lg transition-all"
                  style={{ borderColor: '#BFDBFE', backgroundColor: '#F0F9FF' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    {/* Header */}
                    <div className="flex-1">
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{ color: '#0369A1' }}
                      >
                        {lecture.batchName}
                      </h3>
                      {lecture.topic && (
                        <p
                          className="text-sm font-medium"
                          style={{ color: '#64748B' }}
                        >
                          {lecture.topic}
                        </p>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteLecture(lecture._id)}
                      className="p-2 rounded-lg transition-all hover:shadow-md flex-shrink-0"
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

                  {/* Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Instructor */}
                    <div
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: '#DBEAFE' }}
                    >
                      <p
                        className="text-xs font-semibold mb-1"
                        style={{ color: '#64748B' }}
                      >
                        Instructor
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: '#0369A1' }}
                      >
                        {lecture.instructor?.name}
                      </p>
                    </div>

                    {/* Date */}
                    <div
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: '#DBEAFE' }}
                    >
                      <p
                        className="text-xs font-semibold mb-1"
                        style={{ color: '#64748B' }}
                      >
                        Date
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: '#0369A1' }}
                      >
                        {formatDate(lecture.date)}
                      </p>
                    </div>

                    {/* Time */}
                    <div
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: '#DBEAFE' }}
                    >
                      <p
                        className="text-xs font-semibold mb-1"
                        style={{ color: '#64748B' }}
                      >
                        Time
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: '#0369A1' }}
                      >
                        {formatTime(lecture.startTime)} - {formatTime(lecture.endTime)}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {lecture.notes && (
                    <div
                      className="mt-3 p-3 rounded-lg border-l-4"
                      style={{
                        backgroundColor: '#EFF6FF',
                        borderLeftColor: '#0EA5E9',
                      }}
                    >
                      <p
                        className="text-xs font-semibold mb-1"
                        style={{ color: '#64748B' }}
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
              <p
                className="text-xl font-bold mb-2"
                style={{ color: '#0369A1' }}
              >
                No Lectures Yet
              </p>
              <p className="text-sm mb-6" style={{ color: '#64748B' }}>
                Add lecture batches to this course to get started.
              </p>
              <Link
                to={`/admin/courses/${id}/add-lecture`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl"
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
                Add First Lecture
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetail;
