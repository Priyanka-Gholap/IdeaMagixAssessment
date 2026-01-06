import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    expertise: '',
    profilePicture: null,
  });

  const [profilePreview, setProfilePreview] = useState(null);

  // Handle login
  const handleLogin = async (e, role = 'instructor') => {
    e.preventDefault();

    if (!loginData.email.trim() || !loginData.password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const userData = await login(loginData.email, loginData.password, role);
      toast.success(`Welcome back, ${userData.name}! 🎉`);

      setTimeout(() => {
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/instructor');
        }
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error || 'Login failed');
      setLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', signupData.name);
      formData.append('email', signupData.email);
      formData.append('password', signupData.password);
      formData.append('phone', signupData.phone);
      formData.append('expertise', signupData.expertise);

      if (signupData.profilePicture) {
        formData.append('profilePicture', signupData.profilePicture);
      }

      await signup(formData);
      toast.success('Account created successfully! 🎉');

      setTimeout(() => {
        navigate('/instructor');
      }, 1500);
    } catch (error) {
      toast.error(error || 'Signup failed');
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPEG, PNG, and GIF files are allowed');
        return;
      }

      setSignupData({ ...signupData, profilePicture: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)' }}>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border" style={{ borderColor: '#BFDBFE' }}>
          
          {/* Tab Navigation */}
          <div className="flex border-b" style={{ borderColor: '#BFDBFE' }}>
            <button
              onClick={() => {
                setActiveTab('signin');
                setShowAdminLogin(false);
                setLoginData({ email: '', password: '' });
              }}
              className="flex-1 py-4 font-bold text-base transition-all"
              style={{
                backgroundColor: activeTab === 'signin' ? '#DBEAFE' : 'transparent',
                color: activeTab === 'signin' ? '#0369A1' : '#64748B',
                borderBottom: activeTab === 'signin' ? '3px solid #0EA5E9' : '3px solid transparent',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setShowAdminLogin(false);
                setSignupData({
                  name: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  phone: '',
                  expertise: '',
                  profilePicture: null,
                });
                setProfilePreview(null);
              }}
              className="flex-1 py-4 font-bold text-base transition-all"
              style={{
                backgroundColor: activeTab === 'signup' ? '#DBEAFE' : 'transparent',
                color: activeTab === 'signup' ? '#0369A1' : '#64748B',
                borderBottom: activeTab === 'signup' ? '3px solid #0EA5E9' : '3px solid transparent',
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Forms Container */}
          <div className="p-8">
            
            {/* Sign In Form */}
            {activeTab === 'signin' && (
              <div>
                {!showAdminLogin ? (
                  /* Instructor Login */
                  <>
                    <div className="mb-6 text-center">
                      <h2 className="text-2xl font-bold mb-2" style={{ color: '#0369A1' }}>Welcome Back</h2>
                      <p className="text-sm" style={{ color: '#64748B' }}>Sign in to your instructor account</p>
                    </div>

                    <form onSubmit={(e) => handleLogin(e, 'instructor')} className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold mb-2" style={{ color: '#0369A1' }}>Email Address</label>
                        <input
                          type="email"
                          required
                          className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                          style={{ borderColor: '#BFDBFE' }}
                          placeholder="instructor@example.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                          onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2" style={{ color: '#0369A1' }}>Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                            style={{ borderColor: '#BFDBFE' }}
                            placeholder="••••••••"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                            onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-sm font-semibold"
                            style={{ color: '#0EA5E9' }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)' }}
                        onMouseEnter={(e) => { if (!loading) e.target.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { if (!loading) e.target.style.transform = 'translateY(0)'; }}
                      >
                        {loading ? 'Signing in...' : 'Sign In'}
                      </button>

                      {/* Instructor Demo Credentials */}
                      <div className="p-4 rounded-xl border-2 mt-6" style={{ backgroundColor: '#DBEAFE', borderColor: '#60A5FA' }}>
                        <p className="text-xs font-bold mb-2" style={{ color: '#0369A1' }}>Demo Credentials</p>
                        <div className="space-y-2 text-xs" style={{ color: '#0369A1' }}>
                          <div>
                            <p className="font-bold">Instructor 1</p>
                            <p>Email: instructor1@ideamagix.com</p>
                            <p>Password: instructor123</p>
                          </div>
                          <div>
                            <p className="font-bold">Instructor 2</p>
                            <p>Email: instructor2@ideamagix.com</p>
                            <p>Password: instructor123</p>
                          </div>
                        </div>
                      </div>
                    </form>

                    {/* Switch to Admin Login */}
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => {
                          setShowAdminLogin(true);
                          setLoginData({ email: '', password: '' });
                        }}
                        className="text-sm font-bold transition-colors"
                        style={{ color: '#64748B' }}
                        onMouseEnter={(e) => e.target.style.color = '#0EA5E9'}
                        onMouseLeave={(e) => e.target.style.color = '#64748B'}
                      >
                        Admin Sign In →
                      </button>
                    </div>
                  </>
                ) : (
                  /* Admin Login */
                  <>
                    <div className="mb-6 text-center">
                      <h2 className="text-2xl font-bold mb-2" style={{ color: '#0369A1' }}>Admin Access</h2>
                    </div>

                    <form onSubmit={(e) => handleLogin(e, 'admin')} className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold mb-2" style={{ color: '#0369A1' }}>Admin Email</label>
                        <input
                          type="email"
                          required
                          className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                          style={{ borderColor: '#BFDBFE' }}
                          placeholder="admin@example.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                          onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2" style={{ color: '#0369A1' }}>Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                            style={{ borderColor: '#BFDBFE' }}
                            placeholder="••••••••"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                            onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-sm font-semibold"
                            style={{ color: '#0EA5E9' }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)' }}
                        onMouseEnter={(e) => { if (!loading) e.target.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { if (!loading) e.target.style.transform = 'translateY(0)'; }}
                      >
                        {loading ? 'Verifying...' : 'Access Admin Panel'}
                      </button>

                      {/* Admin Demo Credentials */}
                      <div className="p-4 rounded-xl border-2 mt-6" style={{ backgroundColor: '#DBEAFE', borderColor: '#60A5FA' }}>
                        <p className="text-xs font-bold mb-2" style={{ color: '#0369A1' }}>Admin Demo Credentials</p>
                        <div className="text-xs" style={{ color: '#0369A1' }}>
                          <p className="font-bold">Admin Account</p>
                          <p>Email: admin@ideamagix.com</p>
                          <p>Password: admin123</p>
                        </div>
                      </div>
                    </form>

                    {/* Back to Instructor Login */}
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => {
                          setShowAdminLogin(false);
                          setLoginData({ email: '', password: '' });
                        }}
                        className="text-sm font-bold transition-colors"
                        style={{ color: '#64748B' }}
                        onMouseEnter={(e) => e.target.style.color = '#0EA5E9'}
                        onMouseLeave={(e) => e.target.style.color = '#64748B'}
                      >
                        ← Back to Instructor Login
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Sign Up Form */}
            {activeTab === 'signup' && (
              <div>
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#0369A1' }}>Create Account</h2>
                  <p className="text-sm" style={{ color: '#64748B' }}>Join as an instructor</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#0369A1' }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                      style={{ borderColor: '#BFDBFE' }}
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                      onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#0369A1' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                      style={{ borderColor: '#BFDBFE' }}
                      placeholder="john@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                      onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-bold mb-2"
                        style={{ color: '#0369A1' }}
                      >
                        Password *
                      </label>

                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                          style={{ borderColor: '#BFDBFE' }}
                          placeholder="••••••••"
                          value={signupData.password}
                          onChange={(e) =>
                            setSignupData({ ...signupData, password: e.target.value })
                          }
                          onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                          onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-lg"
                          style={{ color: '#0EA5E9' }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-bold mb-2"
                        style={{ color: '#0369A1' }}
                      >
                        Confirm *
                      </label>

                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                          style={{ borderColor: '#BFDBFE' }}
                          placeholder="••••••••"
                          value={signupData.confirmPassword}
                          onChange={(e) =>
                            setSignupData({ ...signupData, confirmPassword: e.target.value })
                          }
                          onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                          onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-lg"
                          style={{ color: '#0EA5E9' }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: '#0369A1' }}>Phone</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                        style={{ borderColor: '#BFDBFE' }}
                        placeholder="+1 234 567 890"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                        onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: '#0369A1' }}>Expertise</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                        style={{ borderColor: '#BFDBFE' }}
                        placeholder="React, Node.js..."
                        value={signupData.expertise}
                        onChange={(e) => setSignupData({ ...signupData, expertise: e.target.value })}
                        onFocus={(e) => (e.target.style.borderColor = '#0EA5E9')}
                        onBlur={(e) => (e.target.style.borderColor = '#BFDBFE')}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)' }}
                    onMouseEnter={(e) => { if (!loading) e.target.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { if (!loading) e.target.style.transform = 'translateY(0)'; }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>

                  {/* Already have account */}
                  <div className="mt-6 text-center">
                    <p className="text-sm" style={{ color: '#64748B' }}>
                      Already have an account?{' '}
                      <button
                        onClick={() => setActiveTab('signin')}
                        className="font-bold"
                        style={{ color: '#0EA5E9' }}
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
