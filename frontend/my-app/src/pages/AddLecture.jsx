import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';

const AddLecture = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const [formData, setFormData] = useState({
    batchName: '',
    instructor: '',
    date: '',
    startTime: '',
    endTime: '',
    topic: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [courseRes, instructorsRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get('/instructors'),
      ]);
      setCourse(courseRes.data.course);
      setInstructors(instructorsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      navigate('/admin/courses');
    }
  };

  const checkAvailability = async (instructorId, date) => {
    if (!instructorId || !date) return;

    try {
      const { data } = await api.post('/lectures/check-availability', {
        instructorId,
        date,
      });

      setIsAvailable(data.available);
      setAvailabilityMessage(data.message);

      // Show toast notification for availability status
      if (data.available) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'instructor' || name === 'date') {
      const instructorId = name === 'instructor' ? value : formData.instructor;
      const date = name === 'date' ? value : formData.date;

      if (instructorId && date) {
        checkAvailability(instructorId, date);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAvailable) {
      toast.error('Selected instructor is not available on this date');
      return;
    }

    try {
      await api.post('/lectures', {
        ...formData,
        course: id,
      });
      toast.success('Lecture added successfully! 🎉');
      setTimeout(() => {
        navigate(`/admin/courses/${id}`);
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add lecture');
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* Simple centered header */}
      <div className="mb-8 text-center">
        <h1
          className="text-3xl md:text-4xl font-bold mb-1"
          style={{ color: '#0369A1' }}
        >
          Add Lecture
        </h1>
        <p className="text-sm md:text-base" style={{ color: '#64748B' }}>
          Course: <span className="font-bold" style={{ color: '#0369A1' }}>{course?.name}</span>
        </p>
      </div>

      {/* Main Form Container */}
      <div className="max-w-3xl mx-auto">
        <div
          className="bg-white rounded-2xl shadow-lg border"
          style={{ borderColor: '#BFDBFE' }}
        >
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Batch Name */}
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: '#0369A1' }}
                >
                  Batch Name *
                </label>
                <input
                  type="text"
                  name="batchName"
                  required
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                  style={{ borderColor: '#BFDBFE' }}
                  placeholder="e.g., Batch A, Morning Session"
                  value={formData.batchName}
                  onChange={handleInputChange}
                  onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                  onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                />
              </div>

              {/* Instructor Selection */}
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: '#0369A1' }}
                >
                  Instructor *
                </label>
                <select
                  name="instructor"
                  required
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                  style={{ borderColor: '#BFDBFE' }}
                  value={formData.instructor}
                  onChange={handleInputChange}
                  onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                  onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                >
                  <option value="">Select an instructor</option>
                  {instructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.name} {instructor.expertise ? `- ${instructor.expertise}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: '#0369A1' }}
                >
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                  style={{ borderColor: '#BFDBFE' }}
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={handleInputChange}
                  onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                  onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                />

                {/* Availability Message - Below Date Field */}
                {availabilityMessage && (
                  <div
                    className="mt-3 p-4 rounded-xl flex items-start gap-3 border-2"
                    style={{
                      backgroundColor: isAvailable ? '#D1FAE5' : '#FEE2E2',
                      borderColor: isAvailable ? '#6EE7B7' : '#FECACA',
                    }}
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: isAvailable ? '#059669' : '#DC2626' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {isAvailable ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      )}
                    </svg>
                    <p
                      className="text-sm font-medium"
                      style={{ color: isAvailable ? '#047857' : '#991B1B' }}
                    >
                      {availabilityMessage}
                    </p>
                  </div>
                )}
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: '#0369A1' }}
                  >
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                    style={{ borderColor: '#BFDBFE' }}
                    value={formData.startTime}
                    onChange={handleInputChange}
                    onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                    onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: '#0369A1' }}
                  >
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                    style={{ borderColor: '#BFDBFE' }}
                    value={formData.endTime}
                    onChange={handleInputChange}
                    onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                    onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                  />
                </div>
              </div>

              {/* Topic */}
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: '#0369A1' }}
                >
                  Topic
                </label>
                <input
                  type="text"
                  name="topic"
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                  style={{ borderColor: '#BFDBFE' }}
                  placeholder="e.g., Introduction to React Hooks"
                  value={formData.topic}
                  onChange={handleInputChange}
                  onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                  onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                />
              </div>

              {/* Notes */}
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: '#0369A1' }}
                >
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none"
                  style={{ borderColor: '#BFDBFE' }}
                  placeholder="Additional information about this lecture..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                  onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t"
              style={{ borderColor: '#E5E7EB' }}
            >
              <button
                type="submit"
                disabled={!isAvailable}
                className="flex-1 py-3 px-6 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: !isAvailable
                    ? '#94A3B8'
                    : 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                }}
                onMouseEnter={(e) => {
                  if (isAvailable) e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (isAvailable) e.target.style.transform = 'translateY(0)';
                }}
              >
                Add Lecture
              </button>
              <button
                type="button"
                onClick={() => navigate(`/admin/courses/${id}`)}
                className="flex-1 py-3 px-6 rounded-xl font-bold transition-all"
                style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#E2E8F0')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#F1F5F9')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddLecture;
