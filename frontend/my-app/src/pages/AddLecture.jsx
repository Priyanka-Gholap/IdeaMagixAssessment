import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../utils/api";
import { toast, ToastContainer } from "react-toastify";

const AddLecture = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const [formData, setFormData] = useState({
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
  }, [id]);

  const fetchData = async () => {
    try {
      const [courseRes, instructorsRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get("/instructors"),
      ]);
      setCourse(courseRes.data.course);
      setInstructors(instructorsRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
      navigate("/admin/courses");
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAvailable) {
      toast.error("Instructor is not available on selected date");
      return;
    }

    try {
      await api.post("/lectures", {
        ...formData,
        course: id,
      });

      toast.success("Lecture added successfully");
      setTimeout(() => {
        navigate(`/admin/courses/${id}`);
      }, 1200);
    } catch (error) {
      toast.error("Failed to add lecture");
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Add Lecture
        </h1>
        <p className="text-sm text-slate-500">
          Course: <span className="font-medium">{course?.name}</span>
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl bg-white border rounded-xl shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Batch Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Batch Name
            </label>
            <input
              type="text"
              name="batchName"
              required
              value={formData.batchName}
              onChange={handleInputChange}
              className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Instructor
            </label>
            <select
              name="instructor"
              required
              value={formData.instructor}
              onChange={handleInputChange}
              className="w-full rounded-md border px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Instructor</option>
              {instructors.map((ins) => (
                <option key={ins._id} value={ins._id}>
                  {ins.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleInputChange}
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

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleInputChange}
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
                required
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Topic
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full rounded-md border px-3 py-2 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={!isAvailable}
              className="px-6 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              Add Lecture
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/courses/${id}`)}
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

export default AddLecture;
