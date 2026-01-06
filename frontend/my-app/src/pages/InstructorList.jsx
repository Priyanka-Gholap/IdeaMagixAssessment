import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';

const InstructorList = () => {
  const [instructors, setInstructors] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [instructorsRes, lecturesRes] = await Promise.all([
        api.get('/instructors'),
        api.get('/lectures'),
      ]);
      setInstructors(instructorsRes.data);
      setLectures(lecturesRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getInstructorNextLecture = (instructorId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingLectures = lectures
      .filter(
        (lecture) =>
          lecture.instructor?._id === instructorId &&
          new Date(lecture.date) >= today
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return upcomingLectures[0] || null;
  };

  const getInstructorLecturesCount = (instructorId) => {
    return lectures.filter(
      (lecture) => lecture.instructor?._id === instructorId
    ).length;
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

  // Simple loading text while fetching
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg font-semibold" style={{ color: '#0369A1' }}>
            Loading instructors...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* Header Section */}
      <div className="mb-8">
        <h2
          className="text-3xl font-bold text-center"
          style={{ color: '#0369A1' }}
        >
          Instructors
        </h2>
      </div>

      {/* Instructors Grid / Empty State */}
      {instructors.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {instructors.map((instructor) => {
            const nextLecture = getInstructorNextLecture(instructor._id);
            const totalLectures = getInstructorLecturesCount(instructor._id);

            // Optional profile/avatar URL on instructor object
            const profileImage = instructor.profilePicture || instructor.avatar;

            return (
              <div
                key={instructor._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border"
                style={{ borderColor: '#BFDBFE' }}
              >
                {/* Instructor Header */}
                <div
                  className="p-4 border-b"
                  style={{
                    background:
                      'linear-gradient(to right, #EFF6FF, #F0F9FF)',
                    borderColor: '#BFDBFE',
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Profile/Avatar + Name, Expertise & Email */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Small profile circle */}
                      <div className="flex-shrink-0">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={instructor.name}
                            className="w-10 h-10 rounded-full object-cover border"
                            style={{ borderColor: '#BFDBFE' }}
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{
                              backgroundColor: '#DBEAFE',
                              color: '#0369A1',
                            }}
                          >
                            {instructor.name
                              ?.trim()
                              .charAt(0)
                              .toUpperCase() || '?'}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-lg font-bold mb-1"
                          style={{ color: '#0369A1' }}
                        >
                          {instructor.name}
                        </h3>
                        {instructor.expertise && (
                          <p
                            className="text-sm mb-1"
                            style={{ color: '#64748B' }}
                          >
                            {instructor.expertise}
                          </p>
                        )}
                        <p
                          className="text-xs"
                          style={{ color: '#94A3B8' }}
                        >
                          {instructor.email}
                        </p>
                      </div>
                    </div>

                    {/* Lecture Count Badge */}
                    <div
                      className="text-center px-3 py-1 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: '#DBEAFE' }}
                    >
                      <p
                        className="text-xl font-bold"
                        style={{ color: '#0EA5E9' }}
                      >
                        {totalLectures}
                      </p>
                      <p
                        className="text-[10px] font-semibold"
                        style={{ color: '#0369A1' }}
                      >
                        {totalLectures === 1 ? 'Lecture' : 'Lectures'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Next Lecture Status */}
                <div className="p-4">
                  <h4
                    className="text-xs font-bold uppercase tracking-wide mb-3"
                    style={{ color: '#0369A1' }}
                  >
                    Next Scheduled Lecture
                  </h4>

                  {nextLecture ? (
                    <div className="text-center py-1">
                      <span
                        className="inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-bold"
                        style={{
                          backgroundColor: '#D1FAE5',
                          color: '#065F46',
                        }}
                      >
                        ✓ Assigned
                      </span>
                    </div>
                  ) : (
                    <div className="text-center py-1">
                      <span
                        className="inline-block px-4 py-1.5 rounded-lg text-sm font-bold"
                        style={{
                          backgroundColor: '#FEE2E2',
                          color: '#991B1B',
                        }}
                      >
                        Not Assigned
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
              No Instructors Found
            </h3>
            <p
              className="text-base"
              style={{ color: '#64748B' }}
            >
              Instructors will appear here once they sign up.
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default InstructorList;
