import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../utils/api";
import { toast, ToastContainer } from "react-toastify";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data.course);
      setLectures(data.lectures);
    } catch {
      toast.error("Failed to load course");
      navigate("/admin/courses");
    } finally {
      setLoading(false);
    }
  };

  const deleteLecture = async (lectureId) => {
    if (!window.confirm("Delete this lecture?")) return;

    try {
      await api.delete(`/lectures/${lectureId}`);
      toast.success("Lecture deleted");
      fetchCourseDetails();
    } catch {
      toast.error("Failed to delete lecture");
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (t) =>
    new Date(`2000-01-01 ${t}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64 text-sm text-slate-500">
          Loading course details...
        </div>
      </DashboardLayout>
    );
  }

  if (!course) return null;

  return (
    <DashboardLayout>
      <ToastContainer />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">
          {course.name}
        </h1>
        <p className="text-sm text-slate-500">
          {course.level} · {lectures.length} lectures
        </p>
      </div>

      {/* Course Info */}
      <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          {course.image && (
            <img
              src={course.image}
              alt={course.name}
              className="w-full md:w-72 h-44 object-cover rounded-lg"
            />
          )}

          <div className="flex-1">
            <span className="inline-block mb-3 px-3 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-600">
              {course.level}
            </span>

            <p className="text-sm text-slate-600 mb-4">
              {course.description}
            </p>

            <p className="text-xs text-slate-500">
              Created by{" "}
              <span className="font-medium text-slate-700">
                {course.createdBy?.name}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Lectures */}
      <div className="bg-white border rounded-xl shadow-sm">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold text-slate-800">
            Lectures
          </h2>
          <Link
            to={`/admin/courses/${id}/add-lecture`}
            className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Add Lecture
          </Link>
        </div>

        <div className="p-5 space-y-4">
          {lectures.length > 0 ? (
            lectures.map((lecture) => (
              <div
                key={lecture._id}
                className="border rounded-lg p-4 hover:shadow-sm"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-slate-800">
                      {lecture.batchName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {lecture.topic}
                    </p>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-slate-600">
                      <div>{lecture.instructor?.name}</div>
                      <div>{formatDate(lecture.date)}</div>
                      <div>
                        {formatTime(lecture.startTime)} –{" "}
                        {formatTime(lecture.endTime)}
                      </div>
                    </div>

                    {lecture.notes && (
                      <p className="mt-2 text-sm text-slate-500">
                        <span className="font-medium">Notes:</span>{" "}
                        {lecture.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteLecture(lecture._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500">
              No lectures added yet
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetail;
