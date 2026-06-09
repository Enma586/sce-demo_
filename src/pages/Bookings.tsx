import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { clientService } from '../services/clients.service.ts'
import { bookingService } from '../services/bookings.service.ts'
import DataTable from '../components/DataTable.tsx'
import CrudModal from '../components/CrudModal.tsx'
import ConfirmModal from '../components/ConfirmModal.tsx'
import type { Column } from '../components/DataTable.tsx'
import type { FieldConfig } from '../components/CrudModal.tsx'
import type { Client } from '../types/client.ts'
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

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Booking | null>(null)
  const [saving, setSaving] = useState(false)
  const [clients, setClients] = useState<Client[]>([])

  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    bookingService
      .getAll()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const loadClients = useCallback(async () => {
    try {
      const data = await clientService.getAll()
      setClients(data)
    } catch {
      setClients([])
    }
  }, [])

  const buildFields = (): FieldConfig[] => [
    {
      name: 'clientName',
      label: 'Cliente',
      type: 'select',
      required: true,
      options: clients.map((c) => ({ value: c.name, label: c.name })),
    },
    { name: 'service', label: 'Servicio', type: 'text', required: true, placeholder: 'Ej: Consultoría UX' },
    { name: 'date', label: 'Fecha', type: 'date', required: true },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'Pendiente' },
        { value: 'confirmed', label: 'Confirmado' },
        { value: 'completed', label: 'Completado' },
        { value: 'cancelled', label: 'Cancelado' },
      ],
    },
  ]

  const openCreate = async () => {
    await loadClients()
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = async (booking: Booking) => {
    await loadClients()
    setEditing(booking)
    setModalOpen(true)
  }

  const handleSave = async (data: Record<string, string>) => {
    setSaving(true)
    try {
      if (editing?.id) {
        await bookingService.update(editing.id, data)
      } else {
        await bookingService.create(data as Omit<Booking, 'id'>)
      }
      setModalOpen(false)
      load()
    } catch {
      /* error handled silently */
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRequest = (booking: Booking) => {
    setDeleteTarget(booking)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?.id) return
    setDeleting(true)
    try {
      await bookingService.delete(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch {
      /* error handled silently */
    } finally {
      setDeleting(false)
    }
  }

  const columns: Column<Booking>[] = [
    {
      key: 'clientName',
      label: 'Cliente',
      className: 'flex-1',
      render: (b) => (
        <p className="text-base font-bold text-navy-900 leading-tight">{b.clientName}</p>
      ),
    },
    {
      key: 'service',
      label: 'Servicio',
      className: 'w-44 text-sm text-navy-600',
    },
    {
      key: 'date',
      label: 'Fecha',
      className: 'w-32 text-sm text-navy-600',
      render: (b) => {
        const d = new Date(b.date)
        return <span>{d.toLocaleDateString('es-MX')}</span>
      },
    },
    {
      key: 'status',
      label: 'Estado',
      className: 'w-28',
      render: (b) => (
        <span
          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[b.status] ?? 'bg-navy-100 text-navy-500'}`}
        >
          {statusLabel[b.status] ?? b.status}
        </span>
      ),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 doodle-underline mb-1">Reservas</h1>
          <p className="text-sm text-navy-500 mt-2">
            {bookings.length} reserva{bookings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="px-5 py-2.5 rounded-xl bg-blue-accent hover:bg-blue-hover text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          + Nueva Reserva
        </motion.button>
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        keyExtractor={(b) => b.id ?? ''}
        loading={loading}
        emptyMessage="No hay reservas registradas"
        emptyDescription="Las reservas aparecerán aquí una vez que se agenden servicios. Usa el botón superior para crear una."
        onEdit={openEdit}
        onDelete={handleDeleteRequest}
      />

      <CrudModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        fields={buildFields()}
        initialValues={
          editing
            ? { clientName: editing.clientName, service: editing.service, date: editing.date, status: editing.status }
            : undefined
        }
        title={editing ? 'Editar Reserva' : 'Nueva Reserva'}
        saving={saving}
      />

      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar reserva"
        message={`¿Estás seguro de eliminar la reserva de "${deleteTarget?.clientName}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </motion.div>
  )
}
