import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';

const AddCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    level: 'Beginner',
    description: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'image' && value) {
      setImagePreview(value);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#BFDBFE';
    e.currentTarget.style.backgroundColor = '#FFFFFF';

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please drop an image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Course name is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Course description is required');
      return;
    }

    try {
      await api.post('/courses', formData);
      toast.success('Course added successfully! 🎉');
      setTimeout(() => {
        navigate('/admin/courses');
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add course');
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
          Add New Course
        </h1>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto">
        <div
          className="bg-white rounded-2xl shadow-lg border"
          style={{ borderColor: '#BFDBFE' }}
        >
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Course Name */}
                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: '#0369A1' }}
                  >
                    Course Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                    style={{ borderColor: '#BFDBFE', color: '#0F172A' }}
                    placeholder="e.g., MERN Stack Development"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={(e) =>
                      (e.target.style.borderColor = '#0EA5E9')
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = '#BFDBFE')
                    }
                  />
                </div>

                {/* Difficulty Level */}
                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: '#0369A1' }}
                  >
                    Difficulty Level *
                  </label>
                  <select
                    name="level"
                    required
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                    style={{
                      borderColor: '#BFDBFE',
                      color: '#0F172A',
                      backgroundColor: '#FFFFFF',
                    }}
                    value={formData.level}
                    onChange={handleInputChange}
                    onFocus={(e) =>
                      (e.target.style.borderColor = '#0EA5E9')
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = '#BFDBFE')
                    }
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">
                      Intermediate
                    </option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* Course Description */}
                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: '#0369A1' }}
                  >
                    Course Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={8}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none"
                    style={{ borderColor: '#BFDBFE', color: '#0F172A' }}
                    placeholder="Describe what students will learn in this course..."
                    value={formData.description}
                    onChange={handleInputChange}
                    onFocus={(e) =>
                      (e.target.style.borderColor = '#0EA5E9')
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = '#BFDBFE')
                    }
                  />
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-4">
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: '#0369A1' }}
                >
                  Course Image
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div
                    className="rounded-xl overflow-hidden shadow-lg border-2"
                    style={{ borderColor: '#BFDBFE' }}
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {/* Drag and Drop Area (no icons) */}
                <div
                  className="border-2 border-dashed rounded-xl p-8 text-center hover:shadow-md transition-all cursor-pointer"
                  style={{
                    borderColor: '#BFDBFE',
                    backgroundColor: '#F0F9FF',
                  }}
                  onClick={() =>
                    document.getElementById('file-input').click()
                  }
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = '#0EA5E9';
                    e.currentTarget.style.backgroundColor = '#E0F2FE';
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.borderColor = '#BFDBFE';
                    e.currentTarget.style.backgroundColor = '#F0F9FF';
                  }}
                  onDrop={handleDrop}
                >
                  <p
                    className="font-semibold mb-1"
                    style={{ color: '#0369A1' }}
                  >
                    Click to upload
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: '#64748B' }}
                  >
                    PNG, JPG, GIF up to 10MB
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t"
              style={{ borderColor: '#E5E7EB' }}
            >
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl"
                style={{
                  background:
                    'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                }}
                onMouseEnter={(e) =>
                  (e.target.style.transform = 'translateY(-2px)')
                }
                onMouseLeave={(e) =>
                  (e.target.style.transform = 'translateY(0)')
                }
              >
                <span>Create Course</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/courses')}
                className="flex-1 py-3 px-6 rounded-xl font-bold transition-all"
                style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = '#E2E8F0')
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = '#F1F5F9')
                }
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

export default AddCourse;
