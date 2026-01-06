import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


const Sidebar = ({ isOpen = true, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()


  const isActive = (path) => location.pathname === path


  // const handleLogout = () => {
  //   if (window.confirm('Are you sure you want to logout?')) {
  //     logout()
  //     onClose?.()
  //     navigate('/')
  //   }
  // }


  const handleNavClick = () => {
    onClose?.()
  }


  const adminLinks = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/courses', label: 'Manage Courses' },
    { path: '/admin/courses/add', label: 'Add Course' },
    { path: '/admin/instructors', label: 'All Instructors' },
    { path: '/admin/lectures', label: 'Assign Lecture' },
    { path: '/admin/all-lectures', label: 'All Lectures' },
  ]


  const instructorLinks = [
    { path: '/instructor', label: 'Dashboard' },
    { path: '/instructor/lectures', label: 'My Lectures' },
    { path: '/instructor/profile', label: 'Profile' },
  ]


  const links = isAdmin ? adminLinks : instructorLinks


  return (
    <div 
      className="w-60 h-[80vh] mt-4 ml-4 flex flex-col shadow-xl transition-all duration-300 rounded-2xl"
      style={{ backgroundColor: '#FFFFFF', borderRight: '2px solid #BFDBFE' }}
    >
      {/* Header */}
      <div className="p-6 border-b-2 flex items-center justify-between" style={{ 
        background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
        borderColor: '#0EA5E9'
      }}>
        <h1 className="text-2xl font-bold text-white">Menu</h1>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all text-xl font-bold"
        >
          ✕
        </button>
      </div>


      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const active = isActive(link.path)
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={handleNavClick}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: active ? '#DBEAFE' : 'transparent',
                color: active ? '#0369A1' : '#64748B',
                borderLeft: active ? '4px solid #0EA5E9' : '4px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = '#EFF6FF'
                  e.currentTarget.style.color = '#0284C7'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#64748B'
                }
              }}
            >
              <span className="truncate text-base">{link.label}</span>
            </Link>
          )
        })}
      </nav>


      {/* Logout Button Only */}
      {/* <div className="p-4 border-t-2" style={{ borderColor: '#BFDBFE' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-white transition-all hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)' }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <span>Logout</span>
        </button>
      </div> */}
    </div>
  )
}


export default Sidebar
