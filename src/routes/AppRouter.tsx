import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'
import { SidebarProvider } from '../context/SidebarContext.tsx'
import Sidebar from '../components/Sidebar.tsx'
import Navbar from '../components/Navbar.tsx'
import Login from '../pages/Login.tsx'
import Dashboard from '../pages/Dashboard.tsx'
import Clients from '../pages/Clients.tsx'
import Bookings from '../pages/Bookings.tsx'
import Payments from '../pages/Payments.tsx'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-cream">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <div className="flex-1 p-4 lg:p-8 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedLayout>
            <Clients />
          </ProtectedLayout>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedLayout>
            <Bookings />
          </ProtectedLayout>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedLayout>
            <Payments />
          </ProtectedLayout>
        }
      />
    </Routes>
  )
}
