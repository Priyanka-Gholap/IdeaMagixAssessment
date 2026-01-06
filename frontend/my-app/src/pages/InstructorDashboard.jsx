import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast, ToastContainer } from "react-toastify";

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const isUpcoming = (date) =>
    new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0));

  const upcomingLectures = lectures.filter((l) =>
    isUpcoming(l.date)
  );

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
          Welcome back, {user?.name}
        </h1>
        <p className="text-sm text-slate-500">
          Here are your upcoming lectures
        </p>
      </div>

      {/* Upcoming Lectures */}
      <div className="bg-white border rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-slate-800">
            Upcoming Lectures
          </h2>
        </div>

        <div className="p-5">
          {upcomingLectures.length > 0 ? (
            <div className="space-y-4">
              {upcomingLectures.map((lecture) => (
                <div
                  key={lecture._id}
                  className="border rounded-lg p-4 hover:shadow-sm transition"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Course Image */}
                    {lecture.course?.image && (
                      <img
                        src={lecture.course.image}
                        alt={lecture.course.name}
                        className="w-full md:w-28 h-20 object-cover rounded-md"
                      />
                    )}

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800">
                        {lecture.course?.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Batch: {lecture.batchName}
                      </p>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-slate-600">
                        <div>
                          <span className="font-medium">Date:</span>{" "}
                          {formatDate(lecture.date)}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span>{" "}
                          {lecture.startTime} – {lecture.endTime}
                        </div>
                        {lecture.topic && (
                          <div>
                            <span className="font-medium">Topic:</span>{" "}
                            {lecture.topic}
                          </div>
                        )}
                      </div>

                      {lecture.notes && (
                        <p className="mt-2 text-sm text-slate-500">
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
            <div className="text-center py-12 text-slate-500">
              No upcoming lectures scheduled
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorDashboard;
