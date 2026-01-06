import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast, ToastContainer } from "react-toastify";

const InstructorProfile = () => {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [profilePreview, setProfilePreview] = useState(
    user?.profilePicture || null
  );

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    expertise: user?.expertise || "",
    profilePicture: user?.profilePicture || "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePreview(reader.result);
      setFormData({ ...formData, profilePicture: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data } = await api.put(
        `/instructors/${user._id}`,
        formData
      );
      updateUser(data);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">
          My Profile
        </h1>
        <p className="text-sm text-slate-500">
          Update your personal information
        </p>
      </div>

      <div className="max-w-4xl bg-white border rounded-lg p-6">
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-slate-200 flex items-center justify-center text-4xl font-semibold text-slate-600">
                {formData.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <label className="text-sm font-medium text-slate-600 cursor-pointer">
              Change photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Email
              </label>
              <input
                value={formData.email}
                disabled
                className="w-full border rounded-lg px-3 py-2 text-sm bg-slate-100 text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Phone
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Expertise
              </label>
              <textarea
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-2 bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default InstructorProfile;
