import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';

const InstructorProfile = () => {
  const { user, updateUser } = useAuth();
  const [profilePreview, setProfilePreview] = useState(user?.profilePicture || null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    expertise: user?.expertise || '',
    profilePicture: user?.profilePicture || '',
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('📤 Sending profile update:', formData);
      
      const { data } = await api.put(`/instructors/${user._id}`, formData);
      
      console.log('✅ Profile update response:', data);
      
      updateUser(data);
      
      console.log('🔄 Context updated, new user should be:', data);

      toast.success('Profile updated successfully! ✓');
    } catch (error) {
      console.error('❌ Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* Header - Simple Centered Text */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold" style={{ color: '#0369A1' }}>
          My Profile
        </h2>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border" style={{ borderColor: '#BFDBFE' }}>
          <form onSubmit={handleSave} className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column - Profile Picture */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-4" style={{ color: '#0369A1' }}>
                    Profile Picture
                  </label>
                  <div className="flex flex-col items-center">
                    {/* Profile Image Preview */}
                    <div className="mb-6">
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Profile"
                          className="w-48 h-48 rounded-full object-cover shadow-xl ring-4 ring-white"
                          style={{ border: '4px solid #BFDBFE' }}
                        />
                      ) : (
                        <div
                          className="w-48 h-48 rounded-full flex items-center justify-center shadow-xl text-white text-6xl font-bold"
                          style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)' }}
                        >
                          {formData.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div
                      className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all w-full"
                      style={{ borderColor: '#BFDBFE', backgroundColor: '#F0F9FF' }}
                      onClick={() => document.getElementById('profile-input').click()}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E0F2FE'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F0F9FF'}
                    >
                      <p className="font-semibold mb-2" style={{ color: '#0369A1' }}>
                        Click to upload
                      </p>
                      <p className="text-xs" style={{ color: '#64748B' }}>PNG, JPG, GIF up to 10MB</p>
                      <input
                        id="profile-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0369A1' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                    style={{ borderColor: '#BFDBFE', color: '#0F172A' }}
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                    onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0369A1' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    disabled
                    className="w-full px-4 py-3 border-2 rounded-xl cursor-not-allowed"
                    style={{ borderColor: '#BFDBFE', backgroundColor: '#F8FAFC', color: '#94A3B8' }}
                    value={formData.email}
                  />
                  <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Email cannot be changed</p>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0369A1' }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 234 567 890"
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                    style={{ borderColor: '#BFDBFE', color: '#0F172A' }}
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                    onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                  />
                </div>

                {/* Expertise / Bio */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0369A1' }}>
                    Expertise / Bio
                  </label>
                  <textarea
                    name="expertise"
                    rows={5}
                    placeholder="Tell us about your expertise..."
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none"
                    style={{ borderColor: '#BFDBFE', color: '#0F172A' }}
                    value={formData.expertise}
                    onChange={handleChange}
                    onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                    onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-8 pt-6 border-t" style={{ borderColor: '#E5E7EB' }}>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: saving ? '#94A3B8' : 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)' }}
                onMouseEnter={(e) => { if (!saving) e.target.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { if (!saving) e.target.style.transform = 'translateY(0)'; }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorProfile;
