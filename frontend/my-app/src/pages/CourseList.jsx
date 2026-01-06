import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const getLevelStyle = (level) => {
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg font-semibold" style={{ color: '#0369A1' }}>
            Loading courses...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* Simple centered header */}
      <div className="mb-6 text-center">
        <h1
          className="text-3xl md:text-4xl font-bold mb-1"
          style={{ color: '#0369A1' }}
        >
          Course Management
        </h1>
      </div>

      {/* Add button centered, no icon */}
      {/* <div className="mb-8 flex justify-center">
        <Link
          to="/admin/courses/add"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm"
          style={{
            background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
            color: '#FFFFFF',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = 'translateY(-2px)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = 'translateY(0)')
          }
        >
          Add New Course
        </Link>
      </div> */}

      {/* Course Cards - Compact List Layout */}
      {courses.length > 0 ? (
        <div className="space-y-5">
          {courses.map((course) => {
            const level = getLevelStyle(course.level);
            return (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4"
                style={{ borderLeftColor: level.border }}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Left: Image Section - Reduced height */}
                  {course.image && (
                    <div className="lg:w-64 h-48 lg:h-auto flex-shrink-0">
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Right: Content Section - Reduced padding */}
                  <div className="flex-1 p-5 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className="px-3 py-1 text-xs font-bold rounded-lg border"
                            style={{
                              backgroundColor: level.bg,
                              color: level.text,
                              borderColor: level.border,
                            }}
                          >
                            {course.level}
                          </span>
                        </div>
                        <h2
                          className="text-xl md:text-2xl font-bold mb-2"
                          style={{ color: '#0369A1' }}
                        >
                          {course.name}
                        </h2>
                        <p
                          className="text-sm leading-relaxed line-clamp-2"
                          style={{ color: '#64748B' }}
                        >
                          {course.description}
                        </p>
                      </div>

                      {/* Right Action Buttons - Side by side on desktop */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48 flex-shrink-0">
                        <Link
                          to={`/admin/courses/${course._id}`}
                          className="text-center px-4 py-2 rounded-lg font-semibold transition-all text-sm"
                          style={{
                            backgroundColor: '#EFF6FF',
                            color: '#0369A1',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = '#DBEAFE')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = '#EFF6FF')
                          }
                        >
                          Edit Course
                        </Link>
                        <Link
                          to={`/admin/courses/${course._id}`}
                          className="text-center px-4 py-2 rounded-lg font-semibold transition-all text-sm"
                          style={{
                            backgroundColor: '#EFF6FF',
                            color: '#0369A1',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = '#DBEAFE')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = '#EFF6FF')
                          }
                        >
                          View Batches
                        </Link>
                        <Link
                          to={`/admin/courses/${course._id}/add-lecture`}
                          className="text-center px-4 py-2 rounded-lg font-bold text-white transition-all shadow-md hover:shadow-lg text-sm"
                          style={{
                            background:
                              'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform =
                              'translateY(-1px)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform =
                              'translateY(0)')
                          }
                        >
                          Assign Lecture
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="rounded-2xl shadow-lg text-center py-16 px-6 border"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#BFDBFE' }}
        >
          <div className="max-w-md mx-auto">
            
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: '#0369A1' }}
            >
              No Courses Found
            </h3>
            <p className="text-sm mb-6" style={{ color: '#64748B' }}>
              Get started by adding your first course.
            </p>
            <Link
              to="/admin/courses/add"
              className="inline-block px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all text-sm"
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
              Add Course
            </Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CourseList;
