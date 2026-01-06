import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [activeTab, setActiveTab] = useState("signin");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    expertise: "",
    profilePicture: null,
  });

  const handleLogin = async (e, role = "instructor") => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const user = await login(
        loginData.email,
        loginData.password,
        role
      );
      toast.success(`Welcome ${user.name}`);
      setTimeout(() => {
        navigate(user.role === "admin" ? "/admin" : "/instructor");
      }, 800);
    } catch (err) {
      toast.error(err || "Login failed");
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(signupData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await signup(formData);
      toast.success("Account created");
      setTimeout(() => navigate("/instructor"), 1000);
    } catch (err) {
      toast.error(err || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-lg bg-white border rounded-xl shadow-sm">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => {
              setActiveTab("signin");
              setShowAdminLogin(false);
            }}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "signin"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "signup"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-6">
          {/* SIGN IN */}
          {activeTab === "signin" && (
            <>
              <h2 className="text-xl font-semibold text-slate-800 mb-1">
                {showAdminLogin ? "Admin Login" : "Instructor Login"}
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Access your dashboard
              </p>

              <form
                onSubmit={(e) =>
                  handleLogin(e, showAdminLogin ? "admin" : "instructor")
                }
                className="space-y-4"
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        password: e.target.value,
                      })
                    }
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Please wait..." : "Sign In"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAdminLogin(!showAdminLogin)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  {showAdminLogin
                    ? "Back to Instructor Login"
                    : "Admin Sign In"}
                </button>
              </div>
            </>
          )}

          {/* SIGN UP */}
          {activeTab === "signup" && (
            <>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Create Instructor Account
              </h2>

              <form onSubmit={handleSignup} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      password: e.target.value,
                    })
                  }
                  className="w-full border rounded-md px-3 py-2"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full border rounded-md px-3 py-2"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
