import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../utils/api";
import { toast, ToastContainer } from "react-toastify";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data);
    } catch {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64 text-sm text-slate-500">
          Loading courses...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">
          Courses
        </h1>
        <Link
          to="/admin/courses/add"
          className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
        >
          Add Course
        </Link>
      </div>

      {courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full lg:w-64 h-40 object-cover rounded-md"
                  />
                )}

                <div className="flex-1">
                  <span className="inline-block mb-2 px-3 py-1 text-xs rounded-md bg-indigo-50 text-indigo-600">
                    {course.level}
                  </span>

                  <h2 className="text-lg font-semibold text-slate-800 mb-1">
                    {course.name}
                  </h2>

                  <p className="text-sm text-slate-600 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 lg:w-48">
                  <Link
                    to={`/admin/courses/${course._id}`}
                    className="text-sm px-3 py-2 rounded-md border text-center hover:bg-slate-50"
                  >
                    View Details
                  </Link>

                  <Link
                    to={`/admin/courses/${course._id}/add-lecture`}
                    className="text-sm px-3 py-2 rounded-md bg-indigo-600 text-white text-center hover:bg-indigo-700"
                  >
                    Assign Lecture
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-500">
          No courses found
        </div>
      )}
    </DashboardLayout>
  );
};

export default CourseList;
