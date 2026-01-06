import Link from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiLogOut, FiBook } from 'react-icons/fi'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const [currentUser, setCurrentUser] = useState(user)

  useEffect(() => {
    setCurrentUser(user)
    console.log('Navbar User updated:', user)
  }, [user])

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="shadow-lg sticky top-0 z-50" style={{ 
      background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to={isAdmin ? '/admin' : '/instructor'} 
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <FiBook className="text-2xl text-white" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              Lecture Scheduler
            </span>
          </Link>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm">
              {currentUser?.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser?.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/40"
                  onError={(e) => {
                    console.error('Failed to load profile image:', currentUser.profilePicture)
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold bg-white/30">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-white">{currentUser?.name}</p>
                <p className="text-xs text-white/80 uppercase">{currentUser?.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
            >
              <FiLogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
