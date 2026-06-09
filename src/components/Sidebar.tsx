import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowUpRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext.tsx'
import { useSidebar } from '../context/SidebarContext.tsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '◈' },
  { to: '/clients', label: 'Clientes', icon: '◆' },
  { to: '/bookings', label: 'Reservas', icon: '◉' },
  { to: '/payments', label: 'Pagos', icon: '◎' },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { open, setOpen } = useSidebar()

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/login', { replace: true })
  }

  const handleNavClick = () => {
    setOpen(false)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-8 border-b border-navy-100 relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-navy-700 hover:bg-navy-50 transition-colors cursor-pointer"
          aria-label="Cerrar menú"
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt="SCE Studio"
            className="w-9 h-9 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-lg font-bold text-navy-900 leading-tight">
              SCE <span className="text-blue-accent">Studio</span>
            </h1>
            <p className="text-[10px] text-navy-500 tracking-widest uppercase">
              Panel de control
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 pt-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-accent/8 text-blue-accent font-semibold'
                  : 'text-navy-500 hover:text-navy-800 hover:bg-navy-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-base ${isActive ? 'text-blue-accent' : 'text-navy-400 group-hover:text-navy-600'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* CTA block */}
      <div className="px-4 mb-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-navy-800 to-navy-700 border border-navy-600/60">
          <p className="text-xs text-cream leading-relaxed mb-3">
            ¿Te gusta este sistema? Desarrollamos soluciones a medida para tu negocio.
          </p>
          <a
            href="https://www.scesolutions.top/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-accent hover:bg-red-hover text-white text-xs font-semibold transition-colors"
          >
            Cotizar ahora
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-navy-500 hover:text-red-accent hover:bg-red-50 transition-all cursor-pointer"
        >
          <span className="text-base">←</span>
          <span>Salir</span>
        </button>
        <p className="text-[10px] text-navy-400 text-center mt-4">© 2026 SCE Studio</p>
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="absolute left-0 top-0 bottom-0 w-72 bg-white border-r border-navy-200 shadow-2xl flex flex-col"
          >
            {sidebarContent}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
