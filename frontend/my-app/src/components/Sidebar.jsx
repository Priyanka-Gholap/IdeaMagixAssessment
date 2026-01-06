import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const links = isAdmin
    ? [
        { path: "/admin", label: "Dashboard" },
        { path: "/admin/courses", label: "Courses" },
        { path: "/admin/instructors", label: "Instructors" },
        { path: "/admin/lectures", label: "Assign Lectures" },
        { path: "/admin/all-lectures", label: "All Lectures" },
      ]
    : [
        { path: "/instructor", label: "Dashboard" },
        { path: "/instructor/lectures", label: "My Lectures" },
        { path: "/instructor/profile", label: "Profile" },
      ];

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm flex flex-col">
      <div className="px-6 py-5 text-lg font-semibold border-b">
        Navigation
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={`block px-4 py-2 rounded-md text-sm font-medium transition
                ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
