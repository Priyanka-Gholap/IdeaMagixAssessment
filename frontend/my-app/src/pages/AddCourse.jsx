import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../utils/api";
import { toast, ToastContainer } from "react-toastify";

const AddCourse = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    level: "Beginner",
    description: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload a valid image");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Course name is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Course description is required");
      return;
    }

    try {
      await api.post("/courses", formData);
      toast.success("Course added successfully");
      setTimeout(() => navigate("/admin/courses"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add course");
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Add New Course
        </h1>
        <p className="text-sm text-slate-500">
          Create and manage course details
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-4xl bg-white border rounded-xl shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full rounded-md border px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border px-3 py-2 resize-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Course Image
              </label>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-56 object-cover rounded-lg border"
                />
              )}

              <div
                onClick={() => document.getElementById("fileInput").click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50"
              >
                <p className="text-sm font-medium text-slate-600">
                  Click or drag an image to upload
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG up to 10MB
                </p>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
            >
              Create Course
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/courses")}
              className="px-6 py-2 rounded-md border text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddCourse;
