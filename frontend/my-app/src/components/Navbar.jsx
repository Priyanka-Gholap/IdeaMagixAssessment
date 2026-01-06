import { Link } from "react-router-dom";
import { FiLogOut, FiBook } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-slate-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to={isAdmin ? "/admin" : "/instructor"}
          className="flex items-center gap-3 font-semibold"
        >
          <FiBook className="text-xl" />
          <span>Lecture Portal</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-sm text-right">
            <p className="font-medium">{user?.name}</p>
            <p className="text-slate-300 text-xs uppercase">{user?.role}</p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
