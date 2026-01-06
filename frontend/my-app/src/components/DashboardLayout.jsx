import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { FaBars } from 'react-icons/fa'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getPageTitle = () => {
    const path = window.location.pathname.split('/').pop()
    return path
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase()) || 'Dashboard'
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      onClose?.()
      navigate('/')
    }
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#EFF6FF' }}>
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 lg:hidden z-40" 
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full z-50 lg:hidden">
            <Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Header */}
        <header className="bg-white border-b shadow-sm px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30" 
          style={{ borderColor: '#BFDBFE' }}>
          <div className="flex items-center gap-4 justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2.5 rounded-lg transition-all"
              style={{ backgroundColor: '#DBEAFE', color: '#0EA5E9' }}
            >
              <FaBars size={20} />
            </button>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#0369A1' }}>
                {getPageTitle()}
              </h2>
            </div>
            <div className="p-4 ">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-white transition-all hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)' }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#EFF6FF' }}>
          <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: '#BFDBFE' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
