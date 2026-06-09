import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { clientService } from '../services/clients.service.ts'
import { bookingService } from '../services/bookings.service.ts'
import { paymentService } from '../services/payments.service.ts'
import StatsCard from '../components/StatsCard.tsx'
import type { Booking } from '../types/booking.ts'

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

const statusStyle: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-navy-100 text-navy-500',
}

export default function Dashboard() {
  const [kpi, setKpi] = useState<{
    totalClients: number
    activeClients: number
    totalBookings: number
    pendingBookings: number
    totalRevenue: number
    pendingPayments: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])

  useEffect(() => {
    async function load() {
      try {
        const [clients, bookings, payments] = await Promise.all([
          clientService.getAll(),
          bookingService.getAll(),
          paymentService.getAll(),
        ])

        const totalRevenue = payments
          .filter((p) => p.status === 'paid' || p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0)

        const pendingAmount = payments
          .filter((p) => p.status === 'pending')
          .reduce((sum, p) => sum + p.amount, 0)

        setKpi({
          totalClients: clients.length,
          activeClients: clients.filter((c) => c.status === 'active').length,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b) => b.status === 'pending').length,
          totalRevenue,
          pendingPayments: pendingAmount,
        })

        setRecentBookings(bookings.slice(0, 4))
      } catch {
        setKpi(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto sm:auto-rows-[140px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`doodle-border bg-cream/50 animate-pulse ${
              i === 0 ? 'sm:col-span-2 sm:row-span-2' : i === 1 ? 'sm:col-span-2' : ''
            }`}
          />
        ))}
      </div>
    )
  }

  if (!kpi) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-16 h-16 rounded-2xl bg-navy-100 flex items-center justify-center mb-4">
          <span className="text-2xl text-navy-400">◇</span>
        </div>
        <p className="text-lg font-semibold text-navy-900">No hay datos disponibles</p>
        <p className="text-sm text-navy-500 mt-1">Conecta Firebase para ver las métricas.</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <h1 className="text-3xl font-bold text-navy-900 doodle-underline mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto sm:auto-rows-[140px]">
        <StatsCard
          title="Clientes totales"
          value={kpi.totalClients}
          subtitle="Registrados en la plataforma"
          accent="blue"
          trend={{ value: 12, isUp: true }}
          className="sm:col-span-2 sm:row-span-2"
        />

        <StatsCard
          title="Activos"
          value={kpi.activeClients}
          subtitle="Clientes activos"
          accent="cream"
        />

        <StatsCard
          title="Reservas totales"
          value={kpi.totalBookings}
          subtitle="Todas las reservas"
          accent="blue"
        />

        <StatsCard
          title="Pendientes"
          value={kpi.pendingBookings}
          subtitle="Reservas por confirmar"
          accent="red"
        />

        <StatsCard
          title="Ingresos totales"
          value={`$${kpi.totalRevenue.toLocaleString()}`}
          subtitle="Completados"
          accent="cream"
          trend={{ value: 8, isUp: true }}
          className="sm:col-span-2"
        />

        <StatsCard
          title="Por cobrar"
          value={`$${kpi.pendingPayments.toLocaleString()}`}
          subtitle="En proceso"
          accent="red"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, scale: 1.005 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="sm:col-span-2 lg:col-span-4 row-span-2 p-6 doodle-border bg-cream"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-navy-500 mb-4">
            Reservas recientes
          </p>
          <div className="space-y-2">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="grid grid-cols-3 items-center px-4 py-3 rounded-xl bg-white border border-navy-100"
              >
                <span className="text-sm font-semibold text-navy-900">{b.clientName}</span>
                <span className="text-xs text-navy-500 text-center">{b.service}</span>
                <span className="text-right">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[b.status] ?? 'bg-navy-100 text-navy-500'}`}
                  >
                    {statusLabel[b.status] ?? b.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
