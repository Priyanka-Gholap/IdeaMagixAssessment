import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../utils/api";
import { toast, ToastContainer } from "react-toastify";

const AllLectures = () => {
  const navigate = useNavigate();

  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | upcoming | past

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const { data } = await api.get("/lectures");
      setLectures(data);
    } catch (error) {
      toast.error("Failed to fetch lectures");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lectureId) => {
    if (!window.confirm("Delete this lecture?")) return;

    try {
      await api.delete(`/lectures/${lectureId}`);
      toast.success("Lecture deleted");
      fetchLectures();
    } catch {
      toast.error("Failed to delete lecture");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
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

  const filteredLectures = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === "upcoming")
      return lectures.filter((l) => new Date(l.date) >= today);
    if (filter === "past")
      return lectures.filter((l) => new Date(l.date) < today);

    return lectures;
  })();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-slate-500">Loading lectures...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">
          All Lectures
        </h1>

        <button
          onClick={() => navigate("/admin/lectures")}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
        >
          + Assign Lecture
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {["all", "upcoming", "past"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition
              ${
                filter === f
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Lecture List */}
      {filteredLectures.length > 0 ? (
        <div className="space-y-4">
          {filteredLectures.map((lecture) => (
            <div
              key={lecture._id}
              className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                {/* Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-slate-800">
                      {lecture.course?.name}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {lecture.batchName}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-600">
                      {lecture.course?.level}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 font-medium">
                    {lecture.topic}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-600">
                    <div>
                      <p className="font-medium">{lecture.instructor?.name}</p>
                      <p className="text-xs">{lecture.instructor?.expertise}</p>
                    </div>
                    <div>{formatDate(lecture.date)}</div>
                    <div>
                      {formatTime(lecture.startTime)} –{" "}
                      {formatTime(lecture.endTime)}
                    </div>
                  </div>

                  {lecture.notes && (
                    <p className="text-sm text-slate-500 mt-2">
                      <span className="font-medium">Notes:</span>{" "}
                      {lecture.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleDelete(lecture._id)}
                  className="self-start px-3 py-2 rounded-md border border-red-200 text-red-600 text-sm hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-lg p-10 text-center">
          <h3 className="text-lg font-medium text-slate-700 mb-2">
            No lectures found
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            {filter === "all"
              ? "Start by assigning lectures"
              : `No ${filter} lectures available`}
          </p>
          <button
            onClick={() => navigate("/admin/lectures")}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            Assign Lecture
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllLectures;
