import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../utils/api";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalInstructors: 0,
    upcomingLectures: 0,
    totalLectures: 0,
  });

  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, instructorsRes, lecturesRes] = await Promise.all([
        api.get("/courses"),
        api.get("/instructors"),
        api.get("/lectures"),
      ]);

      const courses = coursesRes.data;
      const lectures = lecturesRes.data;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setStats({
        totalCourses: courses.length,
        totalInstructors: instructorsRes.data.length,
        totalLectures: lectures.length,
        upcomingLectures: lectures.filter(
          (l) => new Date(l.date) >= today
        ).length,
      });

      setRecentCourses(courses.slice(0, 3));
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const statsCards = [
    { label: "Total Courses", value: stats.totalCourses, path: "/admin/courses" },
    { label: "Total Instructors", value: stats.totalInstructors, path: "/admin/instructors" },
    { label: "Upcoming Lectures", value: stats.upcomingLectures, path: "/admin/all-lectures" },
    { label: "Total Lectures", value: stats.totalLectures, path: "/admin/all-lectures" },
  ];

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statsCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-semibold text-slate-800">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Courses */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Courses
          </h2>
          <Link
            to="/admin/courses"
            className="text-sm text-indigo-600 hover:underline"
          >
            View all
          </Link>
        </div>

        {recentCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentCourses.map((course) => (
              <Link
                key={course._id}
                to={`/admin/courses/${course._id}`}
                className="border rounded-lg overflow-hidden hover:shadow-md transition"
              >
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-40 object-cover"
                  />
                )}

                <div className="p-4">
                  <span className="inline-block mb-2 px-2 py-0.5 text-xs rounded bg-slate-100 text-slate-600">
                    {course.level}
                  </span>
                  <h3 className="font-medium text-slate-800 mb-1">
                    {course.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-slate-500 mb-4">
              No courses available
            </p>
            <Link
              to="/admin/courses/add"
              className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
            >
              Add First Course
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
