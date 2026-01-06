import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast, ToastContainer } from "react-toastify";

const InstructorLectures = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const { data } = await api.get(`/lectures/instructor/${user._id}`);
      setLectures(data);
    } catch {
      toast.error("Failed to fetch lectures");
    } finally {
      setLoading(false);
    }
  };

  const isUpcoming = (date) =>
    new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0));

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (time) =>
    new Date(`2000-01-01 ${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const filteredLectures = lectures.filter((lecture) => {
    if (filter === "upcoming") return isUpcoming(lecture.date);
    if (filter === "completed") return !isUpcoming(lecture.date);
    return true;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-sm text-slate-500">
          Loading lectures...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">
          My Lectures
        </h1>
        <p className="text-sm text-slate-500">
          View and manage your assigned sessions
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {["upcoming", "completed", "all"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
              filter === type
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Lecture List */}
      {filteredLectures.length > 0 ? (
        <div className="space-y-4">
          {filteredLectures.map((lecture) => (
            <div
              key={lecture._id}
              className="bg-white border rounded-lg p-4 hover:shadow-sm transition"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Course Image */}
                {lecture.course?.image && (
                  <img
                    src={lecture.course.image}
                    alt={lecture.course.name}
                    className="w-full md:w-24 h-20 object-cover rounded-md"
                  />
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium text-slate-800">
                      {lecture.course?.name}
                    </h3>

                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        isUpcoming(lecture.date)
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isUpcoming(lecture.date) ? "Upcoming" : "Completed"}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    Batch: {lecture.batchName} • {lecture.course?.level}
                  </p>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(lecture.date)}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {formatTime(lecture.startTime)} –{" "}
                      {formatTime(lecture.endTime)}
                    </p>
                  </div>

                  {lecture.topic && (
                    <p className="mt-2 text-sm text-slate-700">
                      <span className="font-medium">Topic:</span>{" "}
                      {lecture.topic}
                    </p>
                  )}

                  {lecture.notes && (
                    <p className="mt-1 text-sm text-slate-500">
                      <span className="font-medium">Notes:</span>{" "}
                      {lecture.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-lg text-center py-16 text-slate-500">
          No lectures found for this filter
        </div>
      )}
    </DashboardLayout>
  );
};

export default InstructorLectures;
