import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../utils/api";
import { toast, ToastContainer } from "react-toastify";

const AssignLecture = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const [formData, setFormData] = useState({
    course: "",
    batchName: "",
    instructor: "",
    date: "",
    startTime: "",
    endTime: "",
    topic: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, instructorsRes] = await Promise.all([
        api.get("/courses"),
        api.get("/instructors"),
      ]);
      setCourses(coursesRes.data);
      setInstructors(instructorsRes.data);
    } catch {
      toast.error("Failed to load data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "instructor" || name === "date") {
      const instructorId =
        name === "instructor" ? value : formData.instructor;
      const date = name === "date" ? value : formData.date;

      if (instructorId && date) {
        checkAvailability(instructorId, date);
      }
    }
  };

  const checkAvailability = async (instructorId, date) => {
    if (!instructorId || !date) return;

    try {
      const { data } = await api.post("/lectures/check-availability", {
        instructorId,
        date,
      });

      setIsAvailable(data.available);
      setAvailabilityMessage(data.message);
    } catch {
      toast.error("Failed to check availability");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAvailable) {
      toast.error("Instructor not available for selected date");
      return;
    }

    try {
      await api.post("/lectures", formData);
      toast.success("Lecture assigned successfully");
      setTimeout(() => navigate("/admin/all-lectures"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign lecture");
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">
          Assign Lecture
        </h1>
        <p className="text-sm text-slate-500">
          Assign instructors and schedule lectures
        </p>
      </div>

      {/* Form */}
      <div className="max-w-5xl bg-white border rounded-xl shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Course
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name} ({course.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Batch Name
                </label>
                <input
                  type="text"
                  name="batchName"
                  value={formData.batchName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Instructor
                </label>
                <select
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select instructor</option>
                  {instructors.map((ins) => (
                    <option key={ins._id} value={ins._id}>
                      {ins.name} - {ins.expertise}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />

                {availabilityMessage && (
                  <p
                    className={`mt-2 text-sm ${
                      isAvailable ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {availabilityMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={!isAvailable}
              className="px-6 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              Assign Lecture
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin")}
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

export default AssignLecture;
