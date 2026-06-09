import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext.tsx'
import { useSidebar } from '../context/SidebarContext.tsx'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/clients': 'Clientes',
  '/bookings': 'Reservas',
  '/payments': 'Pagos',
}

export default function Navbar() {
  const location = useLocation()
  const { user } = useAuth()
  const { toggle } = useSidebar()
  const title = pageTitles[location.pathname] ?? 'Dashboard'

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white/70 backdrop-blur-md border-b border-navy-100">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-navy-500 hover:text-navy-800 hover:bg-navy-50 transition-colors cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-bold text-navy-900 tracking-tight">{title}</h2>
      </div>

      <div className="text-right hidden sm:block">
        <p className="text-xs font-semibold text-navy-800">{user?.name ?? 'Usuario'}</p>
        <p className="text-[10px] text-navy-500">{user?.email}</p>
      </div>
    </header>
  )
}
